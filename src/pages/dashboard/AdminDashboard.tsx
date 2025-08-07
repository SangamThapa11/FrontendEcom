import ListPageHeader from "../../components/listing-page/ListHeader";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
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
import userService from "../../services/user.service";
import productService from "../../services/product.service";
import OrderService from "../../services/order.service";
import { toast } from "sonner";

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

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  paidOrders: number;
  monthlyTransactions: { month: string; amount: number }[];
}

const AdminDashboard = () => {
  const { loggedInUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    paidOrders: 0,
    monthlyTransactions: []
  });
  const [loading, setLoading] = useState({
    users: true,
    products: true,
    orders: true
  });

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading({ users: true, products: true, orders: true });
        
        // Fetch all data in parallel
        const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
          userService.getAllUSers({ page: 1, limit: 1 }),
          productService.getAllProduct({ page: 1, limit: 1 }),
          OrderService.getAllOrder({ page: 1, limit: 1 })
        ]);

        // Type assertions for responses
        const usersData = usersResponse as unknown as ApiResponse<any>;
        const productsData = productsResponse as unknown as ApiResponse<any>;
        const ordersData = ordersResponse as unknown as ApiResponse<any>;

        setStats({
          totalUsers: usersData.options.pagination.total,
          totalProducts: productsData.options.pagination.total,
          activeProducts: productsData.data.filter(
            (product: { status: string }) => product.status === 'ACTIVE'
          ).length,
          totalOrders: ordersData.options.pagination.total,
          paidOrders: ordersData.data.filter(
            (order: { isPaid: boolean }) => order.isPaid
          ).length,
          monthlyTransactions: [
            { month: 'Jan', amount: 45000 },
            { month: 'Feb', amount: 52000 },
            { month: 'Mar', amount: 48000 },
            { month: 'Apr', amount: 67000 },
            { month: 'May', amount: 73000 },
            { month: 'Jun', amount: 82000 },
          ]
        });
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error("Dashboard error:", error);
      } finally {
        setLoading({ users: false, products: false, orders: false });
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data for transactions
  const transactionChartData: ChartData<'bar'> = {
    labels: stats.monthlyTransactions.map(item => item.month),
    datasets: [
      {
        label: 'Transaction Amount (Rs.)',
        data: stats.monthlyTransactions.map(item => item.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for order status
  const orderStatusData: ChartData<'pie'> = {
    labels: ['Paid Orders', 'Unpaid Orders'],
    datasets: [
      {
        data: [stats.paidOrders, stats.totalOrders - stats.paidOrders],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
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
        text: 'Monthly Transactions',
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
        text: 'Order Payment Status',
      },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col w-full gap-5 p-5">
      <ListPageHeader pageTitle="Dashboard" />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {loggedInUser?.name}
        </h1>
        <p className="text-gray-600">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              loading={loading.users}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Products"
              value={stats.activeProducts}
              suffix={`/ ${stats.totalProducts}`}
              loading={loading.products}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Paid Orders"
              value={stats.paidOrders}
              suffix={`/ ${stats.totalOrders}`}
              loading={loading.orders}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.monthlyTransactions.reduce((sum, item) => sum + item.amount, 0)}
              prefix="Rs."
              loading={loading.orders}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={16} className="mt-6">
        <Col xs={24} lg={16}>
          <Card title="Monthly Transactions">
            <Bar options={chartOptions} data={transactionChartData} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Order Status">
            <Pie options={pieOptions} data={orderStatusData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;