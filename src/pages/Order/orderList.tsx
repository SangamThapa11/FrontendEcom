import ListPageHeader from "../../components/listing-page/ListHeader";
import { Input, Table, Tag } from "antd";
import {  type IImageType, type IPaginationParams } from "../../config/constants";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderService from "../../services/order.service";
import type { AxiosSuccessResponse } from "../../config/axios.config";

export interface IOrderData {
  _id: string;
  buyer: {
    _id: string;
    name: string;
    email: string;
    image: IImageType;
    address: string;
    phone: string;
  };
  code: string;
  items: Array<{
    _id: string;
    product: string;
    price: number;
    subTotal: number;
    deliveryCharge: number;
    total: number;
    seller: string;
    status: string;
  }>;
  grossTotal: number;
  grossDelivaryTotal: number;
  discount: number;
  subTotal: number;
  tax: number;
  total: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

const OrderListPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0,
  });

  const TableColumns = [
    {
      key: "code",
      title: "Order Code",
      dataIndex: "code",
      render: (code: string) => <span className="font-mono">{code}</span>
    },
    {
      key: "buyer",
      title: "Customer",
      dataIndex: "buyer",
      render: (buyer: IOrderData['buyer']) => (
        <div className="flex items-center gap-2">
          {buyer.image && (
            <img 
              src={buyer.image.thumbUrl} 
              alt={buyer.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-medium">{buyer.name}</div>
            <div className="text-xs text-gray-500">{buyer.email}</div>
          </div>
        </div>
      )
    },
    {
      key: "items",
      title: "Items",
      dataIndex: "items",
      render: (items: IOrderData['items']) => items.length
    },
    {
      key: "total",
      title: "Total Amount",
      dataIndex: "total",
      render: (total: number) => `Rs. ${total.toLocaleString()}`
    },
    {
      key: "status",
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        let color = '';
        switch (status.toLowerCase()) {
          case 'pending':
            color = 'orange';
            break;
          case 'completed':
            color = 'green';
            break;
          case 'cancelled':
            color = 'red';
            break;
          case 'shipped':
            color = 'blue';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      key: "payment",
      title: "Payment",
      dataIndex: "isPaid",
      render: (isPaid: boolean) => (
        <Tag color={isPaid ? 'green' : 'red'}>
          {isPaid ? 'PAID' : 'UNPAID'}
        </Tag>
      )
    },
    {
      key: "createdAt",
      title: "Order Date",
      dataIndex: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString()
    }
  ];

  const [data, setData] = useState<Array<IOrderData>>([]);
  const [search, setSearch] = useState<string>('');

  const loadOrderData = async ({page = 1, limit = 4, search = null}: IPaginationParams) => {
    setLoading(true);
    try {
      const response = await OrderService.getAllOrder({
        page: page,
        limit: limit,
        search: search
      }) as unknown as AxiosSuccessResponse;
      
      setData(response.data);
      setPagination({
        current: response.options.pagination.page,
        pageSize: response.options.pagination.limit,
        total: response.options.pagination.total
      });
    } catch {
      toast.error("Cannot fetch order data", {
        description: "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData({page: 1, limit: 4, search: null});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrderData({
        page: 1,
        limit: 4,
        search: search
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [search]);

  return (
    <div className="flex flex-col w-full gap-5">
      <ListPageHeader pageTitle="Order List" />
      <div className="flex flex-col gap-5">
        <div className="w-full lg:w-1/3">
          <Input.Search 
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            size="large" 
            placeholder="Search orders..."
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
            onChange: async (page: number, pageSize: number) => {
              await loadOrderData({ page, limit: pageSize });
            }
          }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default OrderListPage;