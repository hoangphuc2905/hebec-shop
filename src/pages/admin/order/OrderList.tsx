/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  message,
  DatePicker,
  Select,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./OrderList.css";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/vi_VN";
import { getOrderList } from "../../../api/orderApi";
import type {
  Order,
  FilterOptions,
} from "../../../types/interfaces/order.interface";
import { formatCurrency } from "../../../utils/money";
import { formatDate } from "../../../utils/date";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ORDER_STATUSES = [
  { key: "all", text: "Tất cả", color: "" },
  { key: "new", text: "Đã đặt hàng", color: "#52c41a" },
  { key: "confirmed", text: "Đã xác nhận", color: "#faad14" },
  { key: "processing", text: "Đang xử lý", color: "#108ee9" },
  { key: "shipping", text: "Đang vận chuyển", color: "#1890ff" },
  { key: "completed", text: "Hoàn tất", color: "#52c41a" },
  { key: "cancelled", text: "Đã Hủy", color: "#ff4d4f" },
  { key: "returned", text: "Hoàn trả", color: "#eb2f96" },
];

const AdminOrderList: React.FC = () => {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
        const params: Record<string, unknown> = {
          page: filterOptions.page,
          limit: filterOptions.pageSize,
          type: "ORDER",
        };

        // Thêm search nếu có
        if (filterOptions.search.trim()) {
          params.search = filterOptions.search.trim();
        }

        // Thêm filter theo trạng thái (trừ 'all')
        if (filterOptions.status !== "all") {
          params.status = filterOptions.status.toUpperCase();
        }

        // Thêm filter theo ngày
        if (filterOptions.startDate && filterOptions.endDate) {
          params.startDate = filterOptions.startDate;
          params.endDate = filterOptions.endDate;
        }

        // Thêm filter theo delivery method
        if (filterOptions.deliveryMethod) {
          params.deliveryMethod = filterOptions.deliveryMethod;
        }

        // Thêm filter theo invoice required
        if (filterOptions.invoiceRequired) {
          params.invoiceRequired = filterOptions.invoiceRequired;
        }

        const response = await getOrderList(params);

        if (response && response.status) {
          const orderList = response.data?.orders || [];
          setOrders(orderList);

          // Tính tổng số từ response.data.total
          const totalCount = response.data?.total || orderList.length;
          setTotal(totalCount);

          // Tính toán status counts từ danh sách đơn hàng
          const counts = {
            all: totalCount,
            new: 0,
            confirmed: 0,
            processing: 0,
            shipping: 0,
            completed: 0,
            cancelled: 0,
            returned: 0,
            pending: 0, // Thêm PENDING status
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          orderList.forEach((order: any) => {
            const status = order.status?.toLowerCase();
            if (status === "pending") counts.new++; // Map PENDING -> new
            else if (
              status &&
              (Object.keys(counts) as Array<keyof typeof counts>).includes(
                status as keyof typeof counts
              )
            ) {
              counts[status as keyof typeof counts]++;
            }
          });
          setStatusCounts(counts);

          // Tính toán statistics từ danh sách đơn hàng
          const stats = orderList.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc: any, order: any) => {
              acc.totalValue += order.totalMoney || 0;
              acc.totalShipping += order.shipFee || 0;
              acc.totalPoints += order.paidPoint || 0;
              acc.totalAmount += order.moneyFinal || 0;
              acc.totalDiscount += order.moneyDiscount || 0;
              return acc;
            },
            {
              totalValue: 0,
              totalShipping: 0,
              totalPoints: 0,
              totalAmount: 0,
              totalDiscount: 0,
            }
          );

          setOrderStats(stats);
        } else {
          // Fallback nếu API không trả về đúng format
          console.warn("API response không có status=true:", response);
          setOrders([]);
          setTotal(0);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);

        // Hiển thị thông báo lỗi cụ thể từ API
        const errorMessage =
          error.message ||
          "Không thể tải dữ liệu đơn hàng. Vui lòng thử lại sau.";
        message.error(errorMessage);

        setOrders([]);
        setTotal(0);

        // Reset các counts và stats về 0
        setStatusCounts({
          all: 0,
          new: 0,
          confirmed: 0,
          processing: 0,
          shipping: 0,
          completed: 0,
          cancelled: 0,
          returned: 0,
        });

        setOrderStats({
          totalValue: 0,
          totalShipping: 0,
          totalPoints: 0,
          totalAmount: 0,
          totalDiscount: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterOptions]);


  // Columns của Table - cập nhật theo dữ liệu thực tế
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
      key: "customerName",
      render: (_: any, record: Order) => (
        <div>{record.customer?.fullName || record.receiverName}</div>
      ),
    },
    {
      title: "Số điện thoại",
      key: "customerPhone",
      render: (_: any, record: Order) => (
        <div>{record.customer?.phone || record.receiverPhone}</div>
      ),
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
        // Map API status to display status
        let displayStatus = status?.toLowerCase();
        if (displayStatus === "pending") displayStatus = "new";

        const statusInfo =
          ORDER_STATUSES.find((s) => s.key === displayStatus) ||
          ORDER_STATUSES[0];
        return (
          <Tag color={statusInfo.color || "default"} className="status-tag">
            {statusInfo.text}
          </Tag>
        );
      },
    },

    {
      title: "Tổng tiền",
      dataIndex: "moneyFinal",
      key: "moneyFinal",
      render: (amount: number) => (
        <span style={{ fontWeight: "bold" }}>{formatCurrency(amount)}</span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (timestamp: number) => formatDate(timestamp),
    },
    {
      title: "Thao tác",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: Order) => (
        <Space size="small">
          <Button type="primary" size="small" className="override-ant-btn">
            <Link to={`/admin/orders/${record.id}`}>Chi tiết</Link>
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
              setFilterOptions({
                ...filterOptions,
                status: status.key,
                page: 1,
              })
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
              className="override-ant-btn"
            >
              Tìm kiếm
            </Button>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              className="override-ant-btn"
            >
              Xuất excel đơn hàng
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="override-ant-btn"
            >
              Tạo đơn hàng
            </Button>
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
                setFilterOptions({
                  ...filterOptions,
                  page: filterOptions.page - 1,
                })
              }
            >
              &lt;
            </Button>
            <span className="current-page">{filterOptions.page}</span>
            <Button
              className="pagination-arrow"
              disabled={filterOptions.page * filterOptions.pageSize >= total}
              onClick={() =>
                setFilterOptions({
                  ...filterOptions,
                  page: filterOptions.page + 1,
                })
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
