import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineSend, AiOutlineUndo } from "react-icons/ai";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import Select from "react-select";
import { Spin } from "antd";

import { CancelButton, SubmitButton } from "../../components/form/FormButton";
import { FileUpload, GeneralInput, SelectOption, TextAreaInput } from "../../components/form/input";
import ListPageHeader from "../../components/listing-page/ListHeader";

import categoryService from "../../services/category.service";
import brandService from "../../services/brand.service";
import productService from "../../services/product.service";

import { Status, UserRoles } from "../../config/constants";
import { useAuth } from "../../context/AuthContext";

export interface IProductData {
  _id?: string;
  name: string;
  status: Status;
  isFeatured: boolean;
  brand: string;
  category: string[];
  description: string;
  price: number;
  discount: number;
  afterDiscount: number;
  stock: number;
  sku: string;
  seller?: string;
  images: File[];
}

interface IOption {
  label: string;
  value: string;
}

interface IExistingImage {
  url: string;
  thumbUrl?: string;
  _id?: string;
}

const ProductEditPage: React.FC = () => {
  const { loggedInUser } = useAuth();
  const isSeller = loggedInUser?.role === UserRoles.SELLER;
  const navigate = useNavigate();
  const params = useParams();
  const baseRoute = isSeller ? "/seller/products" : "/admin/products";

  const [loading, setLoading] = useState(true);
  const [brandOptions, setBrandOptions] = useState<IOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<IOption[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [existingImages, setExistingImages] = useState<IExistingImage[]>([]);

  const ProductSchema = Yup.object().shape({
    name: Yup.string().min(2).max(100).required("Product name is required"),
    status: Yup.string().matches(/^(active|inactive)$/).default(Status.INACTIVE),
    isFeatured: Yup.boolean().default(false),
    brand: Yup.string().required("Brand is required"),
    category: Yup.array().of(Yup.string()).min(1, "At least one category is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().min(0.01).required("Price is required"),
    discount: Yup.number().min(0).max(90).nullable().default(0),
    stock: Yup.number().min(0).required("Stock is required"),
    sku: Yup.string().required("SKU is required"),
    images: Yup.array().of(Yup.mixed<File>().required()).min(1, "At least one image is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<IProductData>({
    defaultValues: {
      name: "",
      status: Status.INACTIVE,
      isFeatured: false,
      brand: "",
      category: [],
      description: "",
      price: 0,
      discount: 0,
      afterDiscount: 0,
      stock: 0,
      sku: "",
      ...(isSeller && { seller: loggedInUser?._id }),
      images: [],
    },
    resolver: yupResolver(ProductSchema) as any,
  });

  // Calculate after discount
  const price = watch("price");
  const discount = watch("discount");
  useEffect(() => {
    const afterDiscountValue = price - (price * (discount || 0)) / 100;
    setValue("afterDiscount", afterDiscountValue);
  }, [price, discount, setValue]);

  // Load brands & categories
  const loadBrands = async () => {
    try {
      setLoadingBrands(true);
      const response = isSeller
        ? await productService.getSellerBrands({ page: 1, limit: 1000 })
        : await brandService.getAllBrands({ page: 1, limit: 1000 });

      const brandsData = response.data?.data || response.data?.docs || response.data;
      if (Array.isArray(brandsData)) {
        setBrandOptions(
          brandsData.map((b: any) => ({ label: b.name, value: b._id }))
        );
      }
    } catch {
      toast.error("Failed to load brands");
    } finally {
      setLoadingBrands(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = isSeller
        ? await productService.getSellerCategories({ page: 1, limit: 1000 })
        : await categoryService.getAllCategory({ page: 1, limit: 1000 });

      const categoriesData = response.data?.data || response.data?.docs || response.data;
      if (Array.isArray(categoriesData)) {
        setCategoryOptions(
          categoriesData.map((c: any) => ({ label: c.name, value: c._id }))
        );
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const getProductDetail = useCallback(async () => {
    try {
      const response = await productService.getProductById(params.id as string);
      const product = response.data;

      reset({
        name: product.name,
        status: product.status,
        isFeatured: product.isFeatured,
        brand: product.brand._id || product.brand,
        category: product.category.map((cat: any) => cat._id || cat),
        description: product.description,
        price: product.price,
        discount: product.discount,
        afterDiscount: product.afterDiscount,
        stock: product.stock,
        sku: product.sku,
        seller: product.seller?._id || product.seller,
        images: [],
      });

      if (Array.isArray(product.images)) setExistingImages(product.images);
    } catch {
      toast.error("Failed to load product data");
      navigate(baseRoute);
    } finally {
      setLoading(false);
    }
  }, [params.id, navigate, reset, baseRoute]);

  useEffect(() => {
    loadBrands();
    loadCategories();
    getProductDetail();
  }, [getProductDetail]);

  const onSubmit = async (data: IProductData) => {
    try {
      const formData = new FormData();

      data.images.forEach((file) => formData.append("images", file));
      data.category.forEach((cat) => formData.append("category", cat));
      formData.append("name", data.name);
      formData.append("status", data.status);
      formData.append("isFeatured", String(data.isFeatured));
      formData.append("brand", data.brand);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("discount", String(data.discount || 0));
      formData.append("stock", String(data.stock));
      formData.append("sku", data.sku);

      const sellerId = isSeller ? loggedInUser?._id : data.seller;
      if (sellerId) formData.append("seller", sellerId);

      await productService.updateProduct(params.id as string, formData);
      toast.success("Product updated successfully!");
      navigate(baseRoute);
    } catch (error: any) {
      toast.error("Failed to update product", {
        description: error.message || "Please try again later",
      });
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large">Loading product data...</Spin>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ListPageHeader pageTitle="Edit Product" btnUrl={baseRoute} btnTxt="Back to Products" />

      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium">Product Name</label>
                  <GeneralInput name="name" control={control} errMsg={errors.name?.message} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <SelectOption
                    name="status"
                    control={control}
                    options={[
                      { label: "Active", value: Status.ACTIVE },
                      { label: "Inactive", value: Status.INACTIVE },
                    ]}
                    errMsg={errors.status?.message}
                  />
                </div>

                {!isSeller && (
                  <div>
                    <label className="block text-sm font-medium">Featured</label>
                    <SelectOption
                      name="isFeatured"
                      control={control}
                      options={[
                        { label: "Yes", value: "true" },
                        { label: "No", value: "false" },
                      ]}
                      errMsg={errors.isFeatured?.message}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium">Brand</label>
                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={brandOptions}
                        isLoading={loadingBrands}
                        placeholder="Select brand..."
                        value={brandOptions.find((opt) => opt.value === field.value) || null}
                        onChange={(selected) => field.onChange(selected?.value || "")}
                      />
                    )}
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Categories</label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        isMulti
                        options={categoryOptions}
                        isLoading={loadingCategories}
                        placeholder="Select categories..."
                        value={categoryOptions.filter((opt) =>
                          field.value?.includes(opt.value)
                        )}
                        onChange={(selected) =>
                          field.onChange(
                            selected ? (selected as IOption[]).map((opt) => opt.value) : []
                          )
                        }
                      />
                    )}
                  />
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <TextAreaInput
                    name="description"
                    control={control}
                    errMsg={errors.description?.message}
                  />
                </div>
              </div>

              {/* Right */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium">Price ($)</label>
                  <GeneralInput name="price" control={control} errMsg={errors.price?.message} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Discount (%)</label>
                  <GeneralInput name="discount" control={control} errMsg={errors.discount?.message} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Final Price ($)</label>
                  <GeneralInput name="afterDiscount" control={control} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Stock</label>
                  <GeneralInput name="stock" control={control} errMsg={errors.stock?.message} />
                </div>

                <div>
                  <label className="block text-sm font-medium">SKU</label>
                  <GeneralInput name="sku" control={control} errMsg={errors.sku?.message} />
                </div>

                {!isSeller && (
                  <div>
                    <label className="block text-sm font-medium">Seller ID</label>
                    <GeneralInput name="seller" control={control} errMsg={errors.seller?.message} />
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Images</label>
              <FileUpload
                name="images"
                control={control}
                multiple
                accept="image/*"
                errMsg={errors.images?.message as string}
              />

              {existingImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={image._id || image.url} className="relative group">
                      <img
                        src={image.url || image.thumbUrl}
                        alt=""
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <CancelButton disabled={isSubmitting}>
                <AiOutlineUndo /> Cancel
              </CancelButton>
              <SubmitButton disabled={isSubmitting}>
                <AiOutlineSend /> {isSubmitting ? "Updating..." : "Update Product"}
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;
