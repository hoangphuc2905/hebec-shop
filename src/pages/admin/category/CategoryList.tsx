import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Pagination,
  Tooltip,
  Image,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  SortAscendingOutlined,
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./CategoryList.css";
import { getCategories } from "../../../api/categoryApi";

// Interface cho Category
interface Category {
  id: string;
  name: string;
  image: string;
  status: "active" | "inactive";
  miniAppStatus: "active" | "inactive";
  highlight: number;
  order: number;
}

// Interface cho các tùy chọn tìm kiếm
interface FilterOptions {
  search: string;
  page: number;
  pageSize: number;
}

const AdminCategoryList: React.FC = () => {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: "",
    page: 1,
    pageSize: 50,
  });
  const [total, setTotal] = useState<number>(0);

  // Fetch dữ liệu thực tế từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Chuẩn bị params cho API
        const params = {
          keyword: filterOptions.search || undefined,
          page: filterOptions.page,
          limit: filterOptions.pageSize,
        };

        // Gọi API để lấy danh mục
        const response = await getCategories(params);
        console.log("API response:", response);

        // Xử lý dữ liệu API thực tế
        if (response && response.data && Array.isArray(response.data)) {
          // Cấu trúc response.data là mảng
          const fetchedCategories = response.data.map((item: any) => ({
            id: item.id,
            name: item.name || "",
            // Đảm bảo luôn có image, dùng placeholder nếu không có
            image:
              item.image ||
              item.thumbnail ||
              item.icon ||
              "https://via.placeholder.com/60x60?text=" +
                encodeURIComponent(item.name || ""),
            status: item.isActive ? "active" : "inactive",
            miniAppStatus: item.isVisibleInApp ? "active" : "inactive",
            highlight: item.isHighlight ? 1 : 0,
            order: item.order || 0,
          }));
          setCategories(fetchedCategories);
          setTotal(response.pagination?.total || fetchedCategories.length);
        } else if (
          response &&
          response.productCategories &&
          Array.isArray(response.productCategories)
        ) {
          // Cấu trúc response.productCategories
          const fetchedCategories = response.productCategories.map(
            (item: any) => ({
              id: item.id,
              name: item.name || "",
              image:
                item.image ||
                item.thumbnail ||
                item.icon ||
                "https://via.placeholder.com/60x60?text=" +
                  encodeURIComponent(item.name || ""),
              status: item.isActive ? "active" : "inactive",
              miniAppStatus: item.isVisibleInApp ? "active" : "inactive",
              highlight: item.isHighlight ? 1 : 0,
              order: item.order || 0,
            })
          );
          setCategories(fetchedCategories);
          setTotal(response.total || fetchedCategories.length);
        } else if (
          response &&
          response.status &&
          response.data &&
          Array.isArray(response.data.productCategories)
        ) {
          // Cấu trúc response.data.productCategories
          const fetchedCategories = response.data.productCategories.map(
            (item: any) => ({
              id: item.id,
              name: item.name || "",
              image:
                item.image ||
                item.thumbnail ||
                item.icon ||
                "https://via.placeholder.com/60x60?text=" +
                  encodeURIComponent(item.name || ""),
              status: item.isActive ? "active" : "inactive",
              miniAppStatus: item.isVisibleInApp ? "active" : "inactive",
              highlight: item.isHighlight ? 1 : 0,
              order: item.order || 0,
            })
          );
          setCategories(fetchedCategories);
          setTotal(response.data.total || fetchedCategories.length);
        } else {
          // Nếu không nhận dạng được cấu trúc
          setCategories([]);
          setTotal(0);
          console.warn("Không nhận dạng được cấu trúc API response", response);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        message.error("Không thể tải dữ liệu danh mục sản phẩm.");
        setCategories([]);
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

  // Xử lý xóa danh mục
  const handleDelete = async (id: string) => {
    try {
      // Thực hiện API xóa danh mục
      // await deleteCategory(id);

      // Tạm thời cập nhật UI
      setCategories(categories.filter((category) => category.id !== id));
      message.success("Xóa danh mục thành công");
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      message.error("Không thể xóa danh mục");
    }
  };

  // Columns của Table
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Category) => (
        <div className="category-name-cell">
          <Image
            src={record.image}
            alt={text}
            width={40}
            height={40}
            className="category-image"
            preview={false}
            fallback="https://via.placeholder.com/40x40?text=No+Image"
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/40x40?text=${encodeURIComponent(record.name.charAt(0) || "?")}`;
            }}
          />
          <div className="category-name">{text}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={status === "active" ? "blue" : "default"}
          className="status-tag"
        >
          {status === "active" ? "Hiện" : "Ẩn"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái trên Mini App",
      dataIndex: "miniAppStatus",
      key: "miniAppStatus",
      render: (status: string) => (
        <Tag
          color={status === "active" ? "blue" : "default"}
          className="status-tag"
        >
          {status === "active" ? "Hiện" : "Ẩn"}
        </Tag>
      ),
    },
    {
      title: (
        <span>
          Highlight{" "}
          <Tooltip title="Danh mục nổi bật sẽ được hiển thị ưu tiên trong trang chủ">
            <QuestionCircleOutlined />
          </Tooltip>
        </span>
      ),
      dataIndex: "highlight",
      key: "highlight",
    },
    {
      title: "Thứ tự",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<UnorderedListOutlined />}
            className="products-button"
          >
            <Link to={`/admin/products?category=${record.id}`}>Sản phẩm</Link>
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="edit-button"
          >
            <Link to={`/admin/category/edit/${record.id}`}>Chỉnh sửa</Link>
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              type="primary"
              icon={<DeleteOutlined />}
              className="delete-button"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-category-list">
      {/* Filter và Actions */}
      <Card className="filter-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Nhập tên danh mục"
              value={filterOptions.search}
              onChange={(e) =>
                setFilterOptions({ ...filterOptions, search: e.target.value })
              }
              className="search-input"
            />
          </Col>
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
                onClick={() => (window.location.href = "/admin/category/add")}
              >
                Thêm danh mục
              </Button>
              <Button
                icon={<SortAscendingOutlined />}
                className="sort-button"
                onClick={() =>
                  message.info("Chức năng sắp xếp đang phát triển")
                }
              >
                Sắp xếp
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table Categories */}
      <Card className="table-card">
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="categories-table"
        />

        <div className="pagination-container">
          <div className="pagination-info">Tổng {total} dòng</div>
          <Space>
            <Button
              disabled={filterOptions.page === 1}
              onClick={() => handlePageChange(filterOptions.page - 1)}
            >
              &lt;
            </Button>
            <div className="page-number">{filterOptions.page}</div>
            <Button
              disabled={total <= filterOptions.page * filterOptions.pageSize}
              onClick={() => handlePageChange(filterOptions.page + 1)}
            >
              &gt;
            </Button>
            <div className="page-size-selector">
              <span>50 / trang</span>
            </div>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default AdminCategoryList;
