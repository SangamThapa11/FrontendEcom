import ListPageHeader from "../../components/listing-page/ListHeader";
import { AiOutlineSend, AiOutlineUndo } from "react-icons/ai";
import { CancelButton, SubmitButton } from "../../components/form/FormButton";
import { FileUpload, GeneralInput, SelectOption, TextAreaInput } from "../../components/form/input";
import { Status } from "../../config/constants";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import categoryService from "../../services/category.service";
import brandService from "../../services/brand.service";
import productService from "../../services/product.service";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import Select from 'react-select';
import { Spin } from "antd";
import axiosConfig from "../../config/axios.config";

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
    seller: string;
    images: File[]; // This should be File[] for React Hook Form to handle multipart
}

interface IBrandOption {
    label: string;
    value: string;
}
interface ICategoryOption {
    label: string;
    value: string;
}

interface IExistingImage {
    url: string;
    thumbUrl?: string;
    _id?: string;
}

const ProductEditSchema = Yup.object({
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
    afterDiscount: Yup.number().min(0).optional(),
    stock: Yup.number().min(0).required("Stock is required"),
    sku: Yup.string().required("SKU is required"),
    seller: Yup.string().nullable().default(null),
    images: Yup.array()
        .of(Yup.mixed<File>().required())
        .min(1, "At least one image is required"),
});

const ProductEditPage = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [brandOptions, setBrandOptions] = useState<IBrandOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<ICategoryOption[]>([]);
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [existingImages, setExistingImages] = useState<IExistingImage[]>([]);

    const { control, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, reset } = useForm<IProductData>({
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
            seller: "",
            images: [],
        },
        resolver: yupResolver(ProductEditSchema) as any,
    });

    // Calculate afterDiscount when price or discount changes
    const price = watch("price");
    const discount = watch("discount");
    useEffect(() => {
        const afterDiscountValue = price - (price * (discount || 0)) / 100;
        setValue("afterDiscount", afterDiscountValue);
    }, [price, discount, setValue]);

    const loadBrands = async () => {
        try {
            setLoadingBrands(true);
            const response = (await brandService.getAllBrands({
                page: 1,
                limit: 1000,
            })) as unknown as AxiosSuccessResponse;

            const options = response.data.map((brand: { _id: string; name: string }) => ({
                label: brand.name,
                value: brand._id,
            }));
            setBrandOptions(options);
        } catch (error) {
            console.error("Failed to load brands", error);
            toast.error("Failed to load brand data");
        } finally {
            setLoadingBrands(false);
        }
    };

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = (await categoryService.getAllCategory({
                page: 1,
                limit: 1000,
            })) as unknown as AxiosSuccessResponse;

            const options = response.data.map((category: { _id: string; name: string }) => ({
                label: category.name,
                value: category._id,
            }));
            setCategoryOptions(options);
        } catch (error) {
            console.error("Failed to load categories", error);
            toast.error("Failed to load category data");
        } finally {
            setLoadingCategories(false);
        }
    };

    const getProductDetail = useCallback(async () => {
        try {
            const response = await productService.getProductById(params.id as string);
            const product = response.data;

            // Reset form with product data
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
                seller: product.seller._id || product.seller,
                images: [], 
            });

            // Set existing images for display
            if (product.images && Array.isArray(product.images)) {
                setExistingImages(product.images);
            }

        } catch (error: any) {
            console.error("Failed to load product", error);
            toast.error("Failed to load product data");
            navigate("/admin/products");
        } finally {
            setLoading(false);
        }
    }, [params.id, navigate, reset]);

    useEffect(() => {
        loadBrands();
        loadCategories();
        getProductDetail();
    }, [getProductDetail]);
 /*
    const submitForm = async (data: IProductData) => {
        try {
            
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("status", data.status);
            formData.append("isFeatured", String(data.isFeatured));
            formData.append("brand", data.brand);
            formData.append("description", data.description);
            formData.append("price", String(data.price));
            formData.append("discount", String(data.discount || 0));
            formData.append("afterDiscount", String(data.afterDiscount));
            formData.append("stock", String(data.stock));
            formData.append("sku", data.sku);
            formData.append("seller", data.seller);

            // Append categories
            data.category.forEach((cat) => formData.append("category", cat));

            
            data.images.forEach((file, index) => {
                if (file instanceof File) {
                    formData.append("images", file); 
                }
            });

            // Use a custom function to send FormData
            await updateProductWithFormData(params.id as string, formData);
            toast.success("Product Updated!");
            navigate("/admin/products");
        } catch (exception: any) {
            toast.error("Sorry!", {
                description: exception.message || "Product cannot be updated at this moment. Please try again later.",
            });
        }
    };
    */
    const submitForm = async (data: IProductData) => {
        console.log(data);
        try {
            await productService.updateProduct(params.id as string, data)
            toast.success("Product Updated!");
            navigate('/admin/products')
        } catch (exception: any | unknown) {
            toast.error("Sorry!", {
                description: "Product cannot be uploaded at this moment. Please try again later."
            })
        }
    }

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spin size="large">Loading product data...</Spin>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0">
                <ListPageHeader pageTitle="Edit Product" />
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit(submitForm)} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Left Column */}
                            <div className="space-y-3">
                                {/* Product Name */}
                                <div className="flex flex-col">
                                    <label htmlFor="name" className="mb-1 font-medium">Name:</label>
                                    <GeneralInput
                                        name="name"
                                        control={control}
                                        errMsg={errors?.name?.message}
                                    />
                                </div>

                                {/* Status */}
                                <div className="flex flex-col">
                                    <label htmlFor="status" className="mb-1 font-medium">Status:</label>
                                    <SelectOption
                                        name="status"
                                        control={control}
                                        errMsg={errors?.status?.message}
                                        options={[
                                            { label: "Active", value: Status.ACTIVE },
                                            { label: "Inactive", value: Status.INACTIVE }
                                        ]}
                                    />
                                </div>

                                {/* Featured */}
                                <div className="flex flex-col">
                                    <label htmlFor="isFeatured" className="mb-1 font-medium">Featured:</label>
                                    <SelectOption
                                        name="isFeatured"
                                        control={control}
                                        errMsg={errors?.isFeatured?.message}
                                        options={[
                                            { label: "Yes", value: "true" },
                                            { label: "No", value: "false" }
                                        ]}
                                    />
                                </div>

                                {/* Brand */}
                                <div className="flex flex-col">
                                    <label htmlFor="brand" className="mb-1 font-medium">Brand:</label>
                                    <Controller
                                        name="brand"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={brandOptions}
                                                className="basic-select"
                                                classNamePrefix="select"
                                                isClearable
                                                isSearchable
                                                isLoading={loadingBrands}
                                                placeholder="Select brand..."
                                                value={brandOptions.find(option => option.value === field.value) || null}
                                                onChange={(selected) => {
                                                    field.onChange(selected ? selected.value : "");
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.brand && (
                                        <span className="text-red-500 text-sm mt-1">{errors.brand.message}</span>
                                    )}
                                </div>

                                {/* Categories */}
                                <div className="flex flex-col">
                                    <label htmlFor="category" className="mb-1 font-medium">Categories:</label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={categoryOptions}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                isClearable
                                                isSearchable
                                                isLoading={loadingCategories}
                                                placeholder="Select categories..."
                                                value={categoryOptions.filter(option =>
                                                    field.value?.includes(option.value)
                                                )}
                                                onChange={(selected) => {
                                                    field.onChange(selected ? selected.map(option => option.value) : []);
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.category && (
                                        <span className="text-red-500 text-sm mt-1">{errors.category.message}</span>
                                    )}
                                </div>
                                {/* Description */}
                                <div className="flex flex-col">
                                    <label htmlFor="description" className="mb-1 font-medium">Description:</label>
                                    <TextAreaInput
                                        name="description"
                                        control={control}
                                        errMsg={errors?.description?.message}
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-3">
                                {/* Price */}
                                <div className="flex flex-col">
                                    <label htmlFor="price" className="mb-1 font-medium">Price:</label>
                                    <GeneralInput
                                        name="price"
                                        control={control}
                                        errMsg={errors?.price?.message}
                                    />
                                </div>

                                {/* Discount */}
                                <div className="flex flex-col">
                                    <label htmlFor="discount" className="mb-1 font-medium">Discount (%):</label>
                                    <GeneralInput
                                        name="discount"
                                        control={control}
                                        errMsg={errors?.discount?.message}
                                    />
                                </div>

                                {/* After Discount Price */}
                                <div className="flex flex-col">
                                    <label htmlFor="afterDiscount" className="mb-1 font-medium">After Discount:</label>
                                    <GeneralInput
                                        name="afterDiscount"
                                        control={control}

                                    />
                                </div>

                                {/* Stock */}
                                <div className="flex flex-col">
                                    <label htmlFor="stock" className="mb-1 font-medium">Stock:</label>
                                    <GeneralInput
                                        name="stock"
                                        control={control}
                                        errMsg={errors?.stock?.message}
                                    />
                                </div>

                                {/* SKU */}
                                <div className="flex flex-col">
                                    <label htmlFor="sku" className="mb-1 font-medium">SKU:</label>
                                    <GeneralInput
                                        name="sku"
                                        control={control}
                                        errMsg={errors?.sku?.message}
                                    />
                                </div>

                                {/* Seller */}
                                <div className="flex flex-col">
                                    <label htmlFor="seller" className="mb-1 font-medium">Seller:</label>
                                    <GeneralInput
                                        name="seller"
                                        control={control}
                                        errMsg={errors?.seller?.message}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Images Section */}
                        <div className="border-t pt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-4">Product Images</label>

                            {/* New Image Upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images</label>
                                <FileUpload
                                    name="images"
                                    control={control}
                                    multiple
                                    accept="image/*"
                                    errMsg={errors.images?.message as string}
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Upload additional product images (JPEG, PNG, etc.)
                                </p>
                            </div>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Existing Images</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {existingImages.map((image, index) => (
                                            <div key={image._id || image.url} className="relative group">
                                                <img
                                                    src={image.url || image.thumbUrl}
                                                    alt={`Product image ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Remove image"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Click the × button to remove images before saving
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Form Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <div onClick={() => navigate("/admin/products")} className="cursor-pointer">
                                <CancelButton disabled={isSubmitting}>
                                    <AiOutlineUndo /> <span>Cancel</span>
                                </CancelButton>
                            </div>
                            <SubmitButton disabled={isSubmitting}>
                                <AiOutlineSend /> <span>{isSubmitting ? "Updating..." : "Update Product"}</span>
                            </SubmitButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductEditPage;