import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import ListPageHeader from "../../components/listing-page/ListHeader";
import { Status, type IImageType, type IPaginationParams } from "../../config/constants";
import { Input, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import { toast } from "sonner";
import categoryService from "../../services/category.service";
import productService from "../../services/product.service";
import { NavLink } from "react-router";
import type { ICategoryData } from "../Category/categoryList";

export interface IProductDataType {
    _id: string;
    name: string;
    status: Status;
    isFeatured: boolean;
    brand: { _id: string, name: string };
    category: string[]; // Array of category objects
    description: string;
    price: number;
    discount: number;
    afterDiscount: number;
    stock: number;
    sku: string;
    seller: string;
    images: IImageType[];
}

interface ICategoryMap {
    [key: string]: string;
}

const ProductListPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [categoryMap, setCategoryMap] = useState<ICategoryMap>({});
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });
    const [data, setData] = useState<IProductDataType[]>([]);
    const [search, setSearch] = useState<string>('');

    const loadCategories = async () => {
        try {
            const response = await categoryService.getAllCategory({
                page: 1, 
                limit: 100 
            }) as unknown as AxiosSuccessResponse;

            const map: ICategoryMap = {};
            response.data.forEach((category: {_id: string, name: string}) => {
                map[category._id] = category.name;
            });
            setCategoryMap(map);
        } catch (error) {
            console.error("Failed to load categories:", error);
            toast.error("Failed to load category data");
        }
    };

    const loadProductData = async ({page = 1, limit = 5, search = null}: IPaginationParams) => {
        try {
            setLoading(true);
            const response = await productService.getAllProduct({
                page,
                limit,
                search
            }) as unknown as AxiosSuccessResponse;
            
            setData(response.data);
            setPagination({
                current: response.options.pagination.page,
                pageSize: response.options.pagination.limit,
                total: response.options.pagination.total
            });
        } catch (error) {
            toast.error("Cannot fetch product data", {
                description: "Product data cannot be loaded at this moment. Please try again later."
            });
            console.error("Error loading products:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (productId: string) => {
        setLoading(true);
        try {
            await productService.deleteProductById(productId);
            await loadProductData({ 
                page: pagination.current, 
                limit: pagination.pageSize 
            });
            toast.success("Product Deleted!");
        } catch (error) {
            toast.error("Failed to delete product");
            console.error("Error deleting product:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
        loadProductData({page: 1, limit: 5});
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadProductData({
                page: 1,
                limit: pagination.pageSize, 
                search: search
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, [search]);

    const TableColumns = [
        {
            key: "name",
            title: "Name",
            dataIndex: "name"
        },
        {
            key: "category",
            title: "Categories",
            dataIndex: "category",
            render: (category: ICategoryData[]) => (
                <div className="flex flex-wrap gap-1">
                    {category?.map(categoryId => (
                        <span key={categoryId._id} className="bg-gray-100 px-2 py-1 rounded text-sm">
                            {categoryId.name || "Unknown Category"}
                        </span>
                    ))}
                </div>
            )
        },
        {
            key: "brand",
            title: "Brand",
            dataIndex: "brand",
            render: (brand: { _id: string, name: string }) => (
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {brand?.name || 'Unknown Brand'}
                </span>
            )
        },
        {
            key: "price",
            title: "Price",
            dataIndex: "price",
            render: (price: number) => `$${price.toFixed(2)}`
        },
        {
            key: "discount",
            title: "Discount (%)",
            dataIndex: "discount",
            render: (discount: number) => `${discount}%`
        },
        
        {
            key: "afterDiscount",
            title: "Final Price",
            dataIndex: "afterDiscount",
            render: (price: number) => `$${price.toFixed(2)}`
        },
        
        {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (val: Status) => (
                val === Status.ACTIVE 
                    ? <span className="text-teal-700">Published</span> 
                    : <span className="text-red-700">Unpublished</span>
            )
        },
        {
            key: "images",
            title: "Image",
            dataIndex: "images",
            render: (images: IImageType[]) => (
                images?.length > 0 ? (
                    <img 
                        src={images[0].thumbUrl} 
                        alt="Product" 
                        style={{ 
                            width: 60, 
                            height: 60, 
                            objectFit: "cover", 
                            borderRadius: "4px" 
                        }} 
                    />
                ) : null
            )
        },
        {
            key: "action",
            title: "Action",
            dataIndex: "_id",
            render: (val: string) => (
                <div className="flex gap-1">
                    <div className="flex bg-teal-800 w-10 h-10 rounded-full items-center justify-center hover:bg-teal-900 transition hover:scale-95">
                        <NavLink to={'/admin/products/' + val} className="text-white">
                            <AiOutlineEdit className="w-5 h-5" />
                        </NavLink>
                    </div>
                    <div className="flex bg-red-800 w-10 h-10 rounded-full items-center justify-center hover:bg-red-900 transition hover:scale-95">
                        <Popconfirm
                            title="Delete Product"
                            description="Are you sure you want to delete this product?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => deleteProduct(val)}
                        >
                            <button className="text-white hover:cursor-pointer">
                                <AiOutlineDelete className="w-5 h-5" />
                            </button>
                        </Popconfirm>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col w-full gap-5">
            <ListPageHeader
                pageTitle="Products List"
                btnUrl="/admin/products/create/"
                btnTxt={<><AiOutlinePlus /> <span>Add Product</span></>}
            />
            <div className="flex flex-col gap-5">
                <div className="w-full lg:w-1/3">
                    <Input.Search
                        placeholder="Search products..."
                        allowClear
                        enterButton
                        size="large"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                </div>
            </div>
            <div className="w-full">
                <Table
                    columns={TableColumns}
                    dataSource={data}
                    rowKey="_id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        onChange: (page, pageSize) => {
                            loadProductData({ 
                                page, 
                                limit: pageSize 
                            });
                        }
                    }}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default ProductListPage;