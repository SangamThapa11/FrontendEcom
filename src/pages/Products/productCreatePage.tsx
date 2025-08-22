import React, { useEffect, useState } from "react";
import { AiOutlineSend, AiOutlineUndo } from "react-icons/ai";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import Select from "react-select";

// Components
import { CancelButton, SubmitButton } from "../../components/form/FormButton";
import { FileUpload, GeneralInput, SelectOption, TextAreaInput } from "../../components/form/input";
import ListPageHeader from "../../components/listing-page/ListHeader";

// Services
import categoryService from "../../services/category.service";
import brandService from "../../services/brand.service";
import productService from "../../services/product.service";

// Types & Constants
import { Status, UserRoles } from "../../config/constants";
import { useAuth } from "../../context/AuthContext";

export interface IProductDataType {
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

const ProductCreatePage: React.FC = () => {
  const { loggedInUser } = useAuth();
  const isSeller = loggedInUser?.role === UserRoles.SELLER;
  const navigate = useNavigate();
  const baseRoute = isSeller ? "/seller/products" : "/admin/products";

  // Form Validation Schema
  const ProductCreateSchema = Yup.object().shape({
    name: Yup.string().min(2).max(100).required("Product name is required"),
    status: Yup.string()
      .matches(/^(active|inactive)$/)
      .default(Status.INACTIVE),
    isFeatured: Yup.boolean().default(false),
    brand: Yup.string().required("Brand is required"),
    category: Yup.array().of(Yup.string()).min(1, "At least one category is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().min(0.01).required("Price is required"),
    discount: Yup.number().min(0).max(90).nullable().default(0),
    stock: Yup.number().min(0).required("Stock is required"),
    sku: Yup.string().required("SKU is required"),
    images: Yup.array()
      .of(Yup.mixed<File>().required())
      .min(1, "At least one image is required"),
  });

  const { control, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, } = useForm<IProductDataType>({
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
    resolver: yupResolver(ProductCreateSchema) as any,
  });

  const [brandOptions, setBrandOptions] = useState<IOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<IOption[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryMode, setCategoryMode] = useState<'single' | 'multiple'>('multiple'); // Track category selection mode

  // Calculate afterDiscount price
  const price = watch("price");
  const discount = watch("discount");
  useEffect(() => {
    const afterDiscountValue = (price - (price * (discount || 0)) / 100)/100;
    setValue("afterDiscount", afterDiscountValue);
  }, [price, discount, setValue]);

  // Load brands with seller access
  const loadBrands = async () => {
    try {
      setLoadingBrands(true);
      const response = isSeller
        ? await productService.getSellerBrands({ page: 1, limit: 1000 })
        : await brandService.getAllBrands({ page: 1, limit: 1000 });

      const brandsData = response.data?.data || response.data?.docs || response.data;
      // Check if response.data exists and is an array
      if (brandsData && Array.isArray(brandsData)) {
        setBrandOptions(
          brandsData.map((brand) => ({
            label: brand.name,
            value: brand._id,
          }))
        );
      } else {
        setBrandOptions([]);
        if (!isSeller) {
          toast.error("No brands available");
        }
      }
    } catch (error: any) {
      if (error.response?.status !== 403 || !isSeller) {
        toast.error("Failed to load brands");
      }
      setBrandOptions([]);
    } finally {
      setLoadingBrands(false);
    }
  };


  // Load categories with seller access
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = isSeller
        ? await productService.getSellerCategories({ page: 1, limit: 1000 })
        : await categoryService.getAllCategory({ page: 1, limit: 1000 });

      const categoriesData = response.data?.data || response.data?.docs || response.data;
      // Check if response.data exists and is an array
      if (categoriesData && Array.isArray(categoriesData)) {
        setCategoryOptions(
          categoriesData.map((category) => ({
            label: category.name,
            value: category._id,
          }))
        );
      } else {
        setCategoryOptions([]);
        if (!isSeller) {
          toast.error("No categories available");
        }
      }
    } catch (error: any) {
      if (error.response?.status !== 403 || !isSeller) {
        toast.error("Failed to load categories");
      }
      setCategoryOptions([]);
    } finally {
      setLoadingCategories(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await loadBrands();
      await loadCategories();
    };
    fetchData();
  }, [isSeller]);

  const onSubmit = async (data: IProductDataType) => {
    try {
      const formData = new FormData();

      // Append images
      data.images.forEach((file) => formData.append("images", file));

      // Append categories
      data.category.forEach((cat) => formData.append("category", cat));

      // Append other fields
      formData.append("name", data.name);
      formData.append("status", data.status);
      formData.append("isFeatured", String(data.isFeatured));
      formData.append("brand", data.brand);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("discount", String(data.discount || 0));
      formData.append("stock", String(data.stock));
      formData.append("sku", data.sku);

      // Handle seller (auto for sellers, optional for admins)
      const sellerId = isSeller ? loggedInUser?._id : data.seller;
      if (sellerId) {
        formData.append("seller", sellerId);
      }

      await productService.addProduct(formData);
      toast.success("Product created successfully!");
      navigate(baseRoute);
    } catch (error: any) {
      toast.error("Failed to create product", {
        description: error.message || "Please try again later",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ListPageHeader
        pageTitle={isSeller ? "Add New Product" : "Create Product"}
        btnUrl={baseRoute}
        btnTxt="Back to Products"
      />

      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <GeneralInput
                    name="name"
                    control={control}
                    errMsg={errors.name?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  {loadingBrands ? (
                    <div className="p-2 border rounded bg-gray-100">Loading brands...</div>
                  ) : brandOptions.length > 0 ? (
                    <>
                      <Controller
                        name="brand"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={brandOptions}
                            isLoading={loadingBrands}
                            placeholder="Select brand..."
                            className="basic-select"
                            classNamePrefix="select"
                            value={brandOptions.find((opt) => opt.value === field.value) || null}
                            onChange={(selected) => field.onChange(selected?.value || "")}
                          />
                        )}
                      />
                      {errors.brand && (
                        <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                      )}
                    </>
                  ) : isSeller ? (
                    <div className="p-2 border rounded bg-yellow-50 text-yellow-700">
                      No brands assigned to your account. Please contact admin.
                    </div>
                  ) : (
                    <div className="p-2 border rounded bg-gray-100 text-red-500">
                      No brands available. Please contact support.
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Categories</label>
                    <button
                      type="button"
                      onClick={() => setCategoryMode(categoryMode === 'multiple' ? 'single' : 'multiple')}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {categoryMode === 'multiple' ? 'Switch to single' : 'Switch to multiple'}
                    </button>
                  </div>
                  {loadingCategories ? (
                    <div className="p-2 border rounded bg-gray-100">Loading categories...</div>
                  ) : categoryOptions.length > 0 ? (
                    <>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            isMulti={categoryMode === 'multiple'}
                            options={categoryOptions}
                            isLoading={loadingCategories}
                            placeholder={`Select ${categoryMode === 'multiple' ? 'categories' : 'a category'}...`}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            value={
                              categoryMode === 'multiple'
                                ? categoryOptions.filter((opt) => field.value?.includes(opt.value))
                                : (field.value?.length > 0
                                  ? categoryOptions.find((opt) => opt.value === field.value[0])
                                  : null)
                            }
                            onChange={(selected) => {
                              if (categoryMode === 'multiple') {
                                // Handle multi-select
                                const selectedOptions = selected as IOption[] | null;
                                const values = selectedOptions
                                  ? selectedOptions.map((opt) => opt.value)
                                  : [];
                                field.onChange(values);
                              } else {
                                // Handle single select
                                const selectedOption = selected as IOption | null;
                                const value = selectedOption ? [selectedOption.value] : [];
                                field.onChange(value);
                              }
                            }}
                          />
                        )}
                      />
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </>
                  ) : (
                    <div className="p-2 border rounded bg-gray-100 text-red-500">
                      No categories available. Please contact support.
                    </div>
                  )}
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <TextAreaInput
                    name="description"
                    control={control}
                    errMsg={errors.description?.message}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <GeneralInput
                    name="price"
                    control={control}
                    errMsg={errors.price?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <GeneralInput
                    name="discount"
                    control={control}
                    errMsg={errors.discount?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Final Price ($)
                  </label>
                  <GeneralInput
                    name="afterDiscount"
                    control={control}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <GeneralInput
                    name="stock"
                    control={control}
                    errMsg={errors.stock?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <GeneralInput
                    name="sku"
                    control={control}
                    errMsg={errors.sku?.message}
                  />
                </div>

                {!isSeller && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seller ID</label>
                    <GeneralInput
                      name="seller"
                      control={control}
                      errMsg={errors.seller?.message}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
              <FileUpload
                name="images"
                control={control}
                multiple
                accept="image/*"
                errMsg={errors.images?.message as string}
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload at least one product image (JPEG, PNG, etc.)
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <CancelButton
                disabled={isSubmitting}
              >
                <AiOutlineUndo /> Cancel
              </CancelButton>
              <SubmitButton disabled={isSubmitting}>
                <AiOutlineSend /> {isSubmitting ? "Creating..." : "Create Product"}
              </SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCreatePage;