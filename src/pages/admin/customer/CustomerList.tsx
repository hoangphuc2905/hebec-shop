import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  message,
  Card,
  Row,
  Col,
  DatePicker,
  Tabs,
  Pagination,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./CustomerList.css";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/vi_VN";
import { getCustomerList } from "../../../api/customerApi";

const { Option } = Select;
const { RangePicker } = DatePicker;

// Interface cho Customer
interface Customer {
  id: string;
  name: string;
  phone: string;
  birthday?: string;
  group?: string;
  createdAt: string;
  source?: string;
  points: number;
  referrals: number;
  followOA: boolean;
}

// Interface cho các tùy chọn tìm kiếm
interface FilterOptions {
  search: string;
  hasPhone: string;
  isZaloCustomer: string;
  followOA: string;
  source: string;
  startDate: string | null;
  endDate: string | null;
  page: number;
  pageSize: number;
  tab: string;
}

const AdminCustomerList: React.FC = () => {
  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: "",
    hasPhone: "",
    isZaloCustomer: "",
    followOA: "",
    source: "",
    startDate: null,
    endDate: null,
    page: 1,
    pageSize: 50,
    tab: "withInfo",
  });
  const [total, setTotal] = useState<number>(0);
  const [sources, setSources] = useState<{ id: string; name: string }[]>([]);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Chuẩn bị params cho API
        const params: any = {
          page: filterOptions.page,
          limit: filterOptions.pageSize,
        };

        // Thêm các tham số tìm kiếm nếu có
        if (filterOptions.search) {
          params.keyword = filterOptions.search;
        }

        if (filterOptions.hasPhone === "yes") {
          params.hasPhone = true;
        } else if (filterOptions.hasPhone === "no") {
          params.hasPhone = false;
        }

        if (filterOptions.isZaloCustomer === "yes") {
          params.isZalo = true;
        } else if (filterOptions.isZaloCustomer === "no") {
          params.isZalo = false;
        }

        if (filterOptions.followOA === "yes") {
          params.followOA = true;
        } else if (filterOptions.followOA === "no") {
          params.followOA = false;
        }

        if (filterOptions.source) {
          params.source = filterOptions.source;
        }

        if (filterOptions.startDate) {
          params.startDate = filterOptions.startDate;
        }

        if (filterOptions.endDate) {
          params.endDate = filterOptions.endDate;
        }

        // Thêm tham số filter theo tab
        if (filterOptions.tab === "withInfo") {
          params.hasInfo = true;
        } else if (filterOptions.tab === "withoutInfo") {
          params.hasInfo = false;
        }

        // Gọi API
        const response = await getCustomerList(params);

        // Log response để debug
        console.log("API Response:", response);

        let fetchedCustomers: Customer[] = [];
        let totalCustomers = 0;

        // Kiểm tra cấu trúc response và xử lý dữ liệu phù hợp
        if (response && response.data && Array.isArray(response.data)) {
          // Trường hợp 1: response.data là mảng
          fetchedCustomers = response.data.map((item: any) => ({
            id: item.id || item._id || "",
            name: item.name || "Khách hàng mới",
            phone: item.phone || "",
            birthday: item.birthday || "",
            group: item.group?.name || "",
            createdAt: item.createdAt
              ? dayjs(item.createdAt).format("DD/MM/YYYY")
              : "",
            source: item.source || "",
            points: item.points || 0,
            referrals: item.referrals || 0,
            followOA: item.followOA || false,
          }));
          totalCustomers =
            response.pagination?.total || fetchedCustomers.length;
        } else if (
          response &&
          response.customers &&
          Array.isArray(response.customers)
        ) {
          // Trường hợp 2: response.customers là mảng
          fetchedCustomers = response.customers.map((item: any) => ({
            id: item.id || item._id || "",
            name: item.name || "Khách hàng mới",
            phone: item.phone || "",
            birthday: item.birthday || "",
            group: item.group?.name || "",
            createdAt: item.createdAt
              ? dayjs(item.createdAt).format("DD/MM/YYYY")
              : "",
            source: item.source || "",
            points: item.points || 0,
            referrals: item.referrals || 0,
            followOA: item.followOA || false,
          }));
          totalCustomers = response.total || fetchedCustomers.length;
        } else if (
          response &&
          response.data &&
          response.data.customers &&
          Array.isArray(response.data.customers)
        ) {
          // Trường hợp 3: response.data.customers là mảng
          fetchedCustomers = response.data.customers.map((item: any) => ({
            id: item.id || item._id || "",
            name: item.name || "Khách hàng mới",
            phone: item.phone || "",
            birthday: item.birthday || "",
            group: item.group?.name || "",
            createdAt: item.createdAt
              ? dayjs(item.createdAt).format("DD/MM/YYYY")
              : "",
            source: item.source || "",
            points: item.points || 0,
            referrals: item.referrals || 0,
            followOA: item.followOA || false,
          }));
          totalCustomers = response.data.total || fetchedCustomers.length;
        } else {
          console.warn("Không xác định được cấu trúc dữ liệu API", response);
          message.warning("Cấu trúc dữ liệu không đúng định dạng");
        }

        setCustomers(fetchedCustomers);
        setTotal(totalCustomers);

        // Lấy danh sách nguồn khách hàng nếu có
        if (response && response.sources && Array.isArray(response.sources)) {
          setSources(
            response.sources.map((src: any) => ({
              id: src.id || src._id || "",
              name: src.name || "",
            }))
          );
        } else if (
          response &&
          response.data &&
          response.data.sources &&
          Array.isArray(response.data.sources)
        ) {
          setSources(
            response.data.sources.map((src: any) => ({
              id: src.id || src._id || "",
              name: src.name || "",
            }))
          );
        } else {
          setSources([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khách hàng:", error);
        message.error(
          "Không thể tải dữ liệu khách hàng. Vui lòng thử lại sau."
        );
        setCustomers([]);
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
  const handleTabChange = (activeKey: string) => {
    setFilterOptions({ ...filterOptions, tab: activeKey, page: 1 });
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

  // Columns của Table
  const columns = [
    {
      title: "Họ Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
    },
    {
      title: "Nhóm khách hàng",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Nguồn",
      dataIndex: "source",
      key: "source",
    },
    {
      title: "Điểm",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Giới thiệu",
      dataIndex: "referrals",
      key: "referrals",
      render: (referrals: number) => (
        <Link
          to={`/admin/customers/referrals/${referrals}`}
          className="referral-link"
        >
          {referrals}
        </Link>
      ),
    },
    {
      title: "Theo dõi OA",
      dataIndex: "followOA",
      key: "followOA",
      render: (followOA: boolean) => (
        <Tag color={followOA ? "green" : "red"} className="follow-tag">
          {followOA ? "Đã follow" : "Chưa follow"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Customer) => (
        <Button type="primary" className="update-button">
          Cập nhật
        </Button>
      ),
    },
  ];

  // Items cho Tabs component (thay thế TabPane)
  const tabItems = [
    {
      key: "withInfo",
      label: "Khách có thông tin",
      children: (
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="customers-table"
        />
      ),
    },
    {
      key: "withoutInfo",
      label: "Khách chưa có thông tin",
      children: (
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="customers-table"
        />
      ),
    },
  ];

  return (
    <div className="admin-customer-list">
      {/* Filter và Actions */}
      <Card className="filter-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6} lg={4}>
            <div className="filter-label">Tìm kiếm</div>
            <Input
              placeholder="Nhập tên hoặc sđt"
              value={filterOptions.search}
              onChange={(e) =>
                setFilterOptions({ ...filterOptions, search: e.target.value })
              }
              prefix={<SearchOutlined />}
              className="search-input"
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <div className="filter-label">Có SĐT</div>
            <Select
              placeholder="Tất cả"
              value={filterOptions.hasPhone}
              onChange={(value) =>
                setFilterOptions({ ...filterOptions, hasPhone: value })
              }
              className="filter-select"
              allowClear
            >
              <Option value="yes">Có</Option>
              <Option value="no">Không</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <div className="filter-label">Khách Zalo</div>
            <Select
              placeholder="Tất cả"
              value={filterOptions.isZaloCustomer}
              onChange={(value) =>
                setFilterOptions({ ...filterOptions, isZaloCustomer: value })
              }
              className="filter-select"
              allowClear
            >
              <Option value="yes">Có</Option>
              <Option value="no">Không</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <div className="filter-label">Theo dõi OA</div>
            <Select
              placeholder="Tất cả"
              value={filterOptions.followOA}
              onChange={(value) =>
                setFilterOptions({ ...filterOptions, followOA: value })
              }
              className="filter-select"
              allowClear
            >
              <Option value="yes">Có</Option>
              <Option value="no">Không</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <div className="filter-label">Nguồn khách hàng</div>
            <Select
              placeholder="Tất cả"
              value={filterOptions.source}
              onChange={(value) =>
                setFilterOptions({ ...filterOptions, source: value })
              }
              className="filter-select"
              allowClear
            >
              {sources.map((source) => (
                <Option key={source.id} value={source.id}>
                  {source.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={12} lg={4}>
            <div className="filter-label">Ngày tạo</div>
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
              onChange={handleDateChange}
              className="date-range-picker"
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            />
          </Col>
        </Row>

        <Row className="button-row" gutter={[16, 16]}>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                className="search-button"
              >
                Tìm kiếm
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="add-button"
                onClick={() => (window.location.href = "/admin/customers/add")}
              >
                Thêm mới
              </Button>
              <Button icon={<ImportOutlined />} className="import-button">
                Nhập excel
              </Button>
              <Button icon={<ExportOutlined />} className="export-button">
                Xuất excel
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card className="customer-card">
        <div className="customer-header">
          <div className="customer-count">Tổng số lượng: {total} khách</div>
        </div>

        {/* Thay thế TabPane bằng items */}
        <Tabs
          activeKey={filterOptions.tab}
          onChange={handleTabChange}
          className="customer-tabs"
          items={tabItems}
        />

        <div className="pagination-container">
          <div className="pagination-info">Tổng {total} dòng</div>
          <div className="pagination-controls">
            <Button
              className="pagination-prev"
              disabled={filterOptions.page === 1}
              onClick={() => handlePageChange(filterOptions.page - 1)}
            >
              &lt;
            </Button>
            <span className="pagination-current">{filterOptions.page}</span>
            <Button
              className="pagination-next"
              onClick={() => handlePageChange(filterOptions.page + 1)}
            >
              &gt;
            </Button>
            <Select
              value={`${filterOptions.pageSize}`}
              className="pagination-size"
              onChange={(value) => handlePageChange(1, parseInt(value))}
            >
              <Option value="10">10 / trang</Option>
              <Option value="20">20 / trang</Option>
              <Option value="50">50 / trang</Option>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminCustomerList;
