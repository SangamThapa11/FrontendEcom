// transactions/TransactionsPage.tsx
type TransactionType = IOrderData;
import { Table, Tag, Select, DatePicker, Card, Statistic } from "antd";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import OrderService from "../../services/order.service";
import type { ColumnsType } from 'antd/es/table';
import dayjs from "dayjs";
import ListPageHeader from "../../components/listing-page/ListHeader";
import type { IOrderData } from "../Order/orderList";
import type { AxiosSuccessResponse } from "../../config/axios.config";
import type { Key } from "antd/es/table/interface";

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionsPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>();
  const [transactions, setTransactions] = useState<Array<IOrderData>>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Filter out only paid transactions
const paidTransactions = transactions.filter((transaction: TransactionType) => transaction.isPaid);
  const TableColumns: ColumnsType<IOrderData> = [
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
    key: "total",
    title: "Amount",
    dataIndex: "total",
    render: (total: number) => `Rs. ${total.toLocaleString()}`,
    sorter: (a: IOrderData, b: IOrderData) => a.total - b.total
  },
  {
    key: "payment",
    title: "Payment",
    dataIndex: "isPaid",
    render: (isPaid: boolean) => (
      <Tag color={isPaid ? 'green' : 'red'}>
        {isPaid ? 'PAID' : 'UNPAID'}
      </Tag>
    ),
    filters: [
      { text: 'Paid', value: true },
      { text: 'Unpaid', value: false },
    ],
    onFilter: (value: boolean | Key, record: IOrderData) => record.isPaid === (value as boolean),
  },
  {
    key: "createdAt",
    title: "Date",
    dataIndex: "createdAt",
    render: (date: string) => dayjs(date).format('DD MMM YYYY'),
    sorter: (a: IOrderData, b: IOrderData) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  }
];

  const loadTransactionData = async () => {
    setLoading(true);
    try {
      let startDate, endDate;
      
      // Set date range based on filter
      switch(filter) {
        case 'daily':
          startDate = dayjs().startOf('day');
          endDate = dayjs().endOf('day');
          break;
        case 'weekly':
          startDate = dayjs().startOf('week');
          endDate = dayjs().endOf('week');
          break;
        case 'monthly':
          startDate = dayjs().startOf('month');
          endDate = dayjs().endOf('month');
          break;
        case 'yearly':
          startDate = dayjs().startOf('year');
          endDate = dayjs().endOf('year');
          break;
        case 'custom':
          if (dateRange) {
            startDate = dateRange[0];
            endDate = dateRange[1];
          }
          break;
        default:
          // 'all' or no filter
          startDate = undefined;
          endDate = undefined;
      }

      const response = await OrderService.getAllOrder({
        page: 1,
        limit: 1000, // Fetch all matching records
        isPaid: true, // Only fetch paid orders
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      }) as unknown as AxiosSuccessResponse;
      
      setTransactions(response.data);
      
      // Calculate total amount of paid transactions
      const total = response.data
  .filter((transaction: TransactionType) => transaction.isPaid)
  .reduce((sum: number, item: TransactionType) => sum + item.total, 0);
      toast.error("Cannot fetch transaction data", {
        description: "Please try again later"
      });
     setTotalAmount(total); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactionData();
  }, [filter, dateRange]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    if (value !== 'custom') {
      setDateRange(undefined);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5">
      <ListPageHeader pageTitle="Transactions" />
      
      {/* Summary Card */}
      <Card>
        <div className="flex flex-wrap gap-4">
          <Statistic 
            title="Total Transactions" 
            value={paidTransactions.length} 
          />
          <Statistic 
            title="Total Amount" 
            value={`Rs. ${totalAmount.toLocaleString()}`} 
            valueStyle={{ color: '#3f8600' }}
          />
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-4">
          <Select 
            defaultValue="all" 
            style={{ width: 150 }}
            onChange={handleFilterChange}
          >
            <Option value="all">All Transactions</Option>
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="yearly">Yearly</Option>
            <Option value="custom">Custom Range</Option>
          </Select>
          
          {filter === 'custom' && (
            <RangePicker 
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]]);
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="w-full">
        <Table
          columns= {TableColumns}
          dataSource={paidTransactions}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;