import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { Input, Popconfirm, Table, Tag, Tooltip } from "antd";
import { NavLink, useNavigate } from "react-router";
import { toast } from "sonner";

// Services
import productService from "../../services/product.service";
import categoryService from "../../services/category.service";

// Types
import { Status, type IImageType, type IPaginationParams } from "../../config/constants";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import type { ICategoryData } from "../Category/categoryList";

// Components
import ListPageHeader from "../../components/listing-page/ListHeader";
import { useAuth } from "../../context/AuthContext";
import { UserRoles } from "../../config/constants";

export interface IProductDataType {
  _id: string;
  name: string;
  status: Status;
  isFeatured: boolean;
  brand: { _id: string; name: string };
  category: ICategoryData[];
  description: string;
  price: number;
  discount: number;
  afterDiscount: number;
  stock: number;
  sku: string;
  seller: { _id: string; name: string };
  images: IImageType[];
}

interface ICategoryMap {
  [key: string]: string;
}

const ProductListPage: React.FC = () => {
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();
  const isSeller = loggedInUser?.role === UserRoles.SELLER;
  const baseRoute = isSeller ? "/seller/products" : "/admin/products";

  const [loading, setLoading] = useState<boolean>(true);
  const [categoryMap, setCategoryMap] = useState<ICategoryMap>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [data, setData] = useState<IProductDataType[]>([]);
  const [search, setSearch] = useState<string>("");

  const loadCategories = async () => {
    try {
      const response = (await categoryService.getAllCategory({
        page: 1,
        limit: 100,
      })) as unknown as AxiosSuccessResponse;

      const map: ICategoryMap = {};
      response.data.forEach((category: { _id: string; name: string }) => {
        map[category._id] = category.name;
      });
      setCategoryMap(map);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load category data");
    }
  };

  const loadProductData = async ({ page = 1, limit = 10, search = null }: IPaginationParams) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        search,
        ...(isSeller && { seller: loggedInUser?._id }),
      };

      const response = (await productService.getAllProduct(
        params
      )) as unknown as AxiosSuccessResponse;

      setData(response.data);
      setPagination({
        current: response.options.pagination.page,
        pageSize: response.options.pagination.limit,
        total: response.options.pagination.total,
      });
    } catch (error) {
      toast.error("Cannot fetch product data", {
        description: "Product data cannot be loaded at this moment. Please try again later.",
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
        limit: pagination.pageSize,
      });
      toast.success("Product Deleted!");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  const canEditProduct = (product: IProductDataType) => {
    return !isSeller || product.seller._id === loggedInUser?._id;
  };

  const canDeleteProduct = (product: IProductDataType) => {
    return canEditProduct(product);
  };

  useEffect(() => {
    loadCategories();
    loadProductData({ page: 1, limit: pagination.pageSize });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProductData({
        page: 1,
        limit: pagination.pageSize,
        search: search,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [search]);

  const TableColumns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text: string, record: IProductDataType) => (
        <div className="flex items-center gap-3">
          {record.images?.length > 0 && (
            <img
              src={record.images[0].thumbUrl}
              alt="Product"
              className="w-10 h-10 object-cover rounded"
            />
          )}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Categories",
      dataIndex: "category",
      key: "category",
      render: (categories: ICategoryData[]) => (
        <div className="flex flex-wrap gap-1">
          {categories?.map((category) => (
            <Tag key={category._id} color="blue">
              {category.name}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (brand: { _id: string; name: string }) => (
        <Tag color="geekblue">{brand?.name}</Tag>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
      align: "right",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number) => `${discount}%`,
      align: "right",
    },
    {
      title: "Final Price",
      dataIndex: "afterDiscount",
      key: "afterDiscount",
      render: (price: number) => `$${price.toFixed(2)}`,
      align: "right",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      align: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Status) => (
        <Tag color={status === Status.ACTIVE ? "green" : "red"}>
          {status === Status.ACTIVE ? "Published" : "Unpublished"}
        </Tag>
      ),
    },
    {
      title: "Seller",
      dataIndex: "seller",
      key: "seller",
      render: (seller: { _id: string; name: string }) => seller?.name,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record: IProductDataType) => (
        <div className="flex gap-2">
          <Tooltip title={canEditProduct(record) ? "Edit" : "No permission"}>
            <NavLink
              to={`${baseRoute}/${record._id}`}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                canEditProduct(record)
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <AiOutlineEdit />
            </NavLink>
          </Tooltip>

          <Tooltip title={canDeleteProduct(record) ? "Delete" : "No permission"}>
            <Popconfirm
              title="Delete Product"
              description="Are you sure you want to delete this product?"
              onConfirm={() => deleteProduct(record._id)}
              disabled={!canDeleteProduct(record)}
            >
              <button
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  canDeleteProduct(record)
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!canDeleteProduct(record)}
              >
                <AiOutlineDelete />
              </button>
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <ListPageHeader
        pageTitle="Product Management"
        btnUrl={`${baseRoute}/create`}
        btnTxt={
          <>
            <AiOutlinePlus /> Add Product
          </>
        }
      />

      <div className="my-4">
        <Input.Search
          placeholder="Search products..."
          allowClear
          enterButton
          size="large"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          className="max-w-md"
        />
      </div>

      <Table
        columns={TableColumns}
        dataSource={data}
        rowKey="_id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            loadProductData({
              page,
              limit: pageSize,
            });
          },
        }}
        loading={loading}
        scroll={{ x: 1500 }}
      />
    </div>
  );
};

export default ProductListPage;