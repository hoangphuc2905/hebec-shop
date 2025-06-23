import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  message,
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Switch,
  Tooltip,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  FilterOutlined,
  UpOutlined,
  DownOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./OrderList.css";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/vi_VN";
import { getOrderList } from "../../../api/orderApi";

const { Option } = Select;
const { RangePicker } = DatePicker;

// Define order status types and their display properties
const ORDER_STATUSES = [
  { key: "all", text: "Tất cả", color: "" },
  { key: "new", text: "Đã đặt hàng", color: "#20a4a2" },
  { key: "confirmed", text: "Đã xác nhận", color: "#faad14" },
  { key: "processing", text: "Đang xử lý", color: "#108ee9" },
  { key: "shipping", text: "Đang vận chuyển", color: "#1890ff" },
  { key: "completed", text: "Hoàn tất", color: "#52c41a" },
  { key: "cancelled", text: "Đã Hủy", color: "#ff4d4f" },
  { key: "returned", text: "Hoàn trả", color: "#eb2f96" },
];

// Interface cho Order
interface Order {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  shippingFee: number;
  pointsUsed: number;
  discount: number;
  finalAmount: number;
  createdAt: string;
  shipmentInfo?: string;
  invoiceRequired: boolean;
}

// Interface cho các tùy chọn tìm kiếm
interface FilterOptions {
  search: string;
  startDate: string | null;
  endDate: string | null;
  deliveryMethod: string;
  invoiceRequired: boolean;
  page: number;
  pageSize: number;
  status: string;
}

const AdminOrderList: React.FC = () => {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: "",
    startDate: null,
    endDate: null,
    deliveryMethod: "",
    invoiceRequired: false,
    page: 1,
    pageSize: 50,
    status: "all",
  });
  const [total, setTotal] = useState<number>(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({
    all: 0,
    new: 0,
    confirmed: 0,
    processing: 0,
    shipping: 0,
    completed: 0,
    cancelled: 0,
    returned: 0,
  });
  const [orderStats, setOrderStats] = useState({
    totalValue: 0,
    totalShipping: 0,
    totalPoints: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Các phần giữ nguyên như code bạn đã có
        // ...

        // Mô phỏng dữ liệu cho phát triển UI
        const mockOrders: Order[] = Array(10)
          .fill(null)
          .map((_, index) => ({
            id: `order-${index + 1}`,
            code: `DH-${100000 + index}`,
            customerName: `Khách hàng ${index + 1}`,
            phone: `098765432${index % 10}`,
            paymentMethod: index % 2 === 0 ? "COD" : "Banking",
            status: ORDER_STATUSES[index % 8].key,
            totalAmount: 500000 + index * 50000,
            shippingFee: 30000,
            pointsUsed: index * 10,
            discount: 10000 * (index % 5),
            finalAmount:
              500000 + index * 50000 + 30000 - 10000 * (index % 5),
            createdAt: dayjs()
              .subtract(index, "day")
              .format("DD/MM/YYYY HH:mm"),
            shipmentInfo:
              index % 3 === 0
                ? "Giao hàng tận nơi"
                : "Lấy tại cửa hàng",
            invoiceRequired: index % 4 === 0,
          }));

        setOrders(mockOrders);
        setTotal(100);

        // Mô phỏng số lượng theo trạng thái
        setStatusCounts({
          all: 100,
          new: 20,
          confirmed: 15,
          processing: 10,
          shipping: 5,
          completed: 30,
          cancelled: 15,
          returned: 5,
        });

        // Mô phỏng thống kê
        setOrderStats({
          totalValue: 10500000,
          totalShipping: 600000,
          totalPoints: 550,
          totalAmount: 11000000,
          totalDiscount: 150000,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
        message.error("Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.");
        setOrders([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterOptions]);

  // Xử lý tìm kiếm
  const handleSearch = () => {
    setFilterOptions({ ...filterOptions, page: 1 });
  };

  // Xử lý thay đổi ngày tạo
  const handleDateChange = (dates: any) => {
    if (dates) {
      const [start, end] = dates;
      setFilterOptions({
        ...filterOptions,
        startDate: start ? start.format("YYYY-MM-DD") : null,
        endDate: end ? end.format("YYYY-MM-DD") : null,
      });
    } else {
      setFilterOptions({
        ...filterOptions,
        startDate: null,
        endDate: null,
      });
    }
  };

  // Xử lý thay đổi tab
  const handleStatusChange = (status: string) => {
    setFilterOptions({ ...filterOptions, status, page: 1 });
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number, pageSize?: number) => {
    setFilterOptions({
      ...filterOptions,
      page,
      pageSize: pageSize || filterOptions.pageSize,
    });
  };

  // Xử lý chọn hàng
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRows(selectedRowKeys as string[]);
    },
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  // Columns của Table
  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "code",
      key: "code",
      render: (text: string, record: Order) => (
        <Link to={`/admin/orders/${record.id}`} className="order-code-link">
          {text}
        </Link>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusInfo = ORDER_STATUSES.find(
          (s) => s.key === status
        ) || ORDER_STATUSES[0];
        return (
          <Tag
            color={statusInfo.color || "default"}
            className="status-tag"
          >
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: "Thông tin vận chuyển",
      dataIndex: "shipmentInfo",
      key: "shipmentInfo",
    },
    {
      title: "Ngày tạo đơn",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "",
      key: "action",
      render: (_: any, record: Order) => (
        <Space size="small">
          <Button type="primary" size="small">
            <Link to={`/admin/orders/${record.id}`}>Chi tiết</Link>
          </Button>
          <Button type="default" size="small">
            In
          </Button>
        </Space>
      ),
    },
  ];

  // Render các tabs trạng thái
  const renderStatusTabs = () => {
    return (
      <div className="status-tabs">
        {ORDER_STATUSES.map((status) => (
          <div
            key={status.key}
            className={`status-tab ${
              filterOptions.status === status.key ? "active" : ""
            }`}
            onClick={() =>
              setFilterOptions({ ...filterOptions, status: status.key, page: 1 })
            }
          >
            <span className="tab-text">{status.text}</span>
            <span
              className="tab-count"
              style={{ backgroundColor: status.color || "#20a4a2" }}
            >
              {statusCounts[status.key] || 0}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-order-list">
      {/* Status Tabs */}
      {renderStatusTabs()}

      {/* Filter và Actions */}
      <div className="filter-section">
        <div className="search-row">
          <div className="search-group">
            <div className="label">Tìm kiếm</div>
            <Input
              placeholder="Nhập mã đơn hoặc khách hàng"
              value={filterOptions.search}
              onChange={(e) =>
                setFilterOptions({ ...filterOptions, search: e.target.value })
              }
              className="search-input"
            />
          </div>

          <div className="search-group">
            <div className="label">Ngày tạo đơn</div>
            <RangePicker
              locale={locale}
              format="DD/MM/YYYY"
              value={
                filterOptions.startDate
                  ? [
                      dayjs(filterOptions.startDate),
                      dayjs(filterOptions.endDate),
                    ]
                  : null
              }
              onChange={(dates) => {
                if (dates) {
                  setFilterOptions({
                    ...filterOptions,
                    startDate: dates[0]?.format("YYYY-MM-DD") || null,
                    endDate: dates[1]?.format("YYYY-MM-DD") || null,
                  });
                } else {
                  setFilterOptions({
                    ...filterOptions,
                    startDate: null,
                    endDate: null,
                  });
                }
              }}
              className="date-picker"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            />
          </div>

          <div className="search-group">
            <div className="label">Hình thức giao</div>
            <Select
              placeholder="Tất cả"
              value={filterOptions.deliveryMethod}
              onChange={(value) =>
                setFilterOptions({ ...filterOptions, deliveryMethod: value })
              }
              className="delivery-select"
              allowClear
              suffixIcon={<DownOutlined />}
            >
              <Option value="shipping">Giao hàng</Option>
              <Option value="pickup">Lấy tại cửa hàng</Option>
            </Select>
          </div>

          <div className="action-buttons">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => setFilterOptions({ ...filterOptions, page: 1 })}
              className="search-button"
            >
              Tìm kiếm
            </Button>
            <Button
              icon={<FileExcelOutlined />}
              className="export-button"
            >
              Xuất excel đơn hàng
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="create-button"
            >
              Tạo đơn hàng
            </Button>
          </div>
        </div>

        <div className="invoice-switch-row">
          <div className="invoice-switch-container">
            <Switch
              checked={filterOptions.invoiceRequired}
              onChange={(checked) =>
                setFilterOptions({ ...filterOptions, invoiceRequired: checked })
              }
              className="invoice-switch"
            />
            <span className="invoice-label">Yêu cầu hóa đơn</span>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="statistics-bar">
        <div className="statistic-item">
          <span className="statistic-label">Tổng giá trị đơn:</span>
          <span className="statistic-value">
            {formatCurrency(orderStats.totalValue)}
          </span>
        </div>
        <div className="statistic-item">
          <span className="statistic-label">Tổng tiền ship:</span>
          <span className="statistic-value">
            {formatCurrency(orderStats.totalShipping)}
          </span>
        </div>
        <div className="statistic-item">
          <span className="statistic-label">Tổng điểm sử dụng:</span>
          <span className="statistic-value">
            {formatCurrency(orderStats.totalPoints)}
          </span>
        </div>
        <div className="statistic-item">
          <span className="statistic-label">Tổng tiền hàng:</span>
          <span className="statistic-value">
            {formatCurrency(orderStats.totalAmount)}
          </span>
        </div>
        <div className="statistic-item">
          <span className="statistic-label">Tổng tiền KM:</span>
          <span className="statistic-value">
            {formatCurrency(orderStats.totalDiscount)}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <Table
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys: React.Key[]) =>
              setSelectedRows(selectedRowKeys as string[]),
          }}
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="orders-table"
        />

        {/* Pagination */}
        <div className="pagination-row">
          <div className="total-info">Tổng {total} dòng</div>
          <div className="pagination-controls">
            <Button
              className="pagination-arrow"
              disabled={filterOptions.page === 1}
              onClick={() =>
                setFilterOptions({ ...filterOptions, page: filterOptions.page - 1 })
              }
            >
              &lt;
            </Button>
            <span className="current-page">{filterOptions.page}</span>
            <Button
              className="pagination-arrow"
              disabled={filterOptions.page * filterOptions.pageSize >= total}
              onClick={() =>
                setFilterOptions({ ...filterOptions, page: filterOptions.page + 1 })
              }
            >
              &gt;
            </Button>
            <div className="page-size-selector">
              <span>{filterOptions.pageSize} / trang</span>
              <DownOutlined className="arrow-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderList;