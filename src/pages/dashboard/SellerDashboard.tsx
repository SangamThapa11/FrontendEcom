import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Table, Tag } from "antd";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
  type ChartOptions
} from 'chart.js';
import OrderService from "../../services/order.service";
import productService from "../../services/product.service";
import { toast } from "sonner";
import dayjs from "dayjs";
import type { IPaginationParams } from "../../config/constants";
import userService from "../../services/user.service";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ApiResponse<T> {
  data: T[];
  options: {
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

interface SellerStats {
  totalUsers: number;
  activeUsers: number; 
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  monthlyEarnings: { month: string; amount: number }[];
  recentOrders: any[];
}

interface OrderItem {
  _id: string;
  product: string;
  price: number;
  quantity: number;
  status: string;
  createdAt: string;
}

const SellerDashboard = () => {
  const { loggedInUser } = useAuth();
  const [stats, setStats] = useState<SellerStats>({
    totalUsers: 0,
    activeUsers: 0, 
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    monthlyEarnings: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState({
    products: true,
    orders: true
  });

  // Fetch seller dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading({ products: true, orders: true });
        //Fetching data
        const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
          userService.getAllUSers({ page: 1, limit: 1 }),
          productService.getAllProduct({ page: 1, limit: 1 }),
          OrderService.getAllOrder({ page: 1, limit: 1 })
        ]);
        //assertions for response
         const usersData = usersResponse as unknown as ApiResponse<any>;
        const productsData = productsResponse as unknown as ApiResponse<any>;
        const ordersData = ordersResponse as unknown as ApiResponse<any>;
        // Process orders data
        const allOrderItems: OrderItem[] = [];
        ordersData.data.forEach((order: any) => {
          order.items.forEach((item: any) => {
            if (item.seller === loggedInUser?._id) {
              allOrderItems.push({
                ...item,
                createdAt: order.createdAt
              });
            }
          });
        });

        // Calculate monthly earnings (mock data - replace with actual calculation)
        const monthlyEarnings = [
          { month: dayjs().subtract(5, 'month').format('MMM'), amount: 12500 },
          { month: dayjs().subtract(4, 'month').format('MMM'), amount: 18900 },
          { month: dayjs().subtract(3, 'month').format('MMM'), amount: 14200 },
          { month: dayjs().subtract(2, 'month').format('MMM'), amount: 21000 },
          { month: dayjs().subtract(1, 'month').format('MMM'), amount: 24500 },
          { month: dayjs().format('MMM'), amount: 18700 },
        ];

        setStats({
          totalUsers: usersData.options.pagination.total,
          activeUsers: usersData.data.filter(
            (user: { status: string }) => user.status === 'ACTIVE'
          ).length,
          totalProducts: productsData.options.pagination.total,
          activeProducts: productsData.data.filter(
            (product: { status: string }) => product.status === 'ACTIVE'
          ).length,
          totalOrders: allOrderItems.length,
          pendingOrders: allOrderItems.filter(
            (item: { status: string }) => item.status === 'PENDING'
          ).length,
          completedOrders: allOrderItems.filter(
            (item: { status: string }) => item.status === 'COMPLETED'
          ).length,
          monthlyEarnings,
          recentOrders: allOrderItems.slice(0, 5) // Get 5 most recent orders
        });
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error("Dashboard error:", error);
      } finally {
        setLoading({ products: false, orders: false });
      }
    };

    if (loggedInUser?._id) {
      fetchDashboardData();
    }
  }, [loggedInUser?._id]);

  // Chart data for earnings
  const earningsChartData: ChartData<'bar'> = {
    labels: stats.monthlyEarnings.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Earnings (Rs.)',
        data: stats.monthlyEarnings.map(item => item.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for order status
  const orderStatusData: ChartData<'pie'> = {
    labels: ['Completed', 'Pending', 'Other'],
    datasets: [
      {
        data: [
          stats.completedOrders,
          stats.pendingOrders,
          stats.totalOrders - stats.completedOrders - stats.pendingOrders
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Earnings',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (Rs.)'
        }
      }
    }
  };

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Order Status Distribution',
      },
    },
  };

  // Columns for recent orders table
  const orderColumns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (product: any) => product.name || 'N/A'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `Rs. ${price.toFixed(2)}`
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        switch (status.toLowerCase()) {
          case 'completed':
            color = 'green';
            break;
          case 'pending':
            color = 'orange';
            break;
          case 'cancelled':
            color = 'red';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD MMM YYYY')
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col w-full gap-5 p-5">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Seller Dashboard - Welcome, {loggedInUser?.name}
        </h1>
        <p className="text-gray-600">Overview of your seller account activities</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              loading={loading.products}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Active Products"
              value={stats.activeProducts}
              loading={loading.products}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              loading={loading.orders}
            />
          </Card>
        </Col>
      </Row>

      {/* Second Row Stats */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Pending Orders"
              value={stats.pendingOrders}
              loading={loading.orders}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Completed Orders"
              value={stats.completedOrders}
              loading={loading.orders}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="This Month's Earnings"
              value={stats.monthlyEarnings[stats.monthlyEarnings.length - 1]?.amount || 0}
              prefix="Rs."
              loading={loading.orders}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={16} className="mt-6">
        <Col xs={24} lg={16}>
          <Card title="Monthly Earnings">
            <Bar options={chartOptions} data={earningsChartData} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Order Status">
            <Pie options={pieOptions} data={orderStatusData} />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Table */}
      <Card title="Recent Orders" className="mt-6">
        <Table
          columns={orderColumns}
          dataSource={stats.recentOrders}
          rowKey="_id"
          pagination={false}
          loading={loading.orders}
        />
      </Card>
    </div>
  );
};

export default SellerDashboard;