/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  message,
  Image,
  Pagination,
  Card,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./ProductList.css";
import { getProducts } from "../../../api/productApi";
import type { Product } from "../../../types/interfaces/product.interface";
import { formatPrice } from "../../../utils/money";

const { Option } = Select;

// Interface cho các tùy chọn tìm kiếm
interface FilterOptions {
  search: string;
  category: string;
  page: number;
  pageSize: number;
}

const AdminProductList: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: "",
    category: "",
    page: 1,
    pageSize: 50,
  });
  const [total, setTotal] = useState<number>(0);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Chuẩn bị params cho API
        const params = {
          keyword: filterOptions.search || undefined,
          categoryId: filterOptions.category || undefined,
          page: filterOptions.page,
          limit: filterOptions.pageSize,
        };

        // Gọi API để lấy sản phẩm
        const response = await getProducts(params);

        // Kiểm tra cấu trúc dữ liệu trước khi xử lý
        console.log("API response:", response);

        // Xử lý dữ liệu trả về và map vào cấu trúc phù hợp
        let fetchedProducts = [];

        // Xử lý response theo cấu trúc thực tế API
        if (
          response &&
          response.data &&
          response.data.products &&
          Array.isArray(response.data.products)
        ) {
          // Cấu trúc thực tế: response.data.products
          fetchedProducts = response.data.products.map((item: any) => ({
            id: item.id,
            name: item.name || "",
            image: item.image || "https://via.placeholder.com/60x60",
            code: item.code || `SP${item.id}`,
            price: item.unitPrice || item.finalPrice || 0,
            sold: item.sold || 0,
            category: item.productCategory?.name || "Chưa phân loại",
            rating: item.totalStar || 0,
            featured: item.isHighlight || false,
            status: item.isActive ? "active" : "inactive",
          }));

          // Sử dụng tổng số từ API
          setTotal(response.data.total || fetchedProducts.length);
        } else if (
          response &&
          response.products &&
          Array.isArray(response.products)
        ) {
          // Cấu trúc khác: response.products
          fetchedProducts = response.products.map((item: any) => ({
            id: item.id,
            name: item.name || "",
            image: item.image || "https://via.placeholder.com/60x60",
            code: item.code || `SP${item.id}`,
            price: item.unitPrice || item.finalPrice || 0,
            sold: item.sold || 0,
            category: item.productCategory?.name || "Chưa phân loại",
            rating: item.totalStar || 0,
            featured: item.isHighlight || false,
            status: item.isActive ? "active" : "inactive",
          }));

          // Sử dụng tổng số từ API
          setTotal(response.total || fetchedProducts.length);
        } else if (response && response.data && Array.isArray(response.data)) {
          // Cấu trúc khác: response.data là array
          fetchedProducts = response.data.map((item: any) => ({
            id: item.id || item._id,
            name: item.name,
            image: item.image || "https://via.placeholder.com/60x60",
            code: item.sku || item.code || `SP${item.id}`,
            price: item.price || 0,
            sold: item.soldQuantity || item.sold || 0,
            category: item.category?.name || "Chưa phân loại",
            rating: item.rating || 0,
            featured: item.featured || false,
            status: item.status || "active",
          }));
          setTotal(response?.pagination?.total || fetchedProducts.length);
        } else if (
          response &&
          response.items &&
          Array.isArray(response.items)
        ) {
          // Cấu trúc cũ 2
          fetchedProducts = response.items.map((item: any) => ({
            id: item.id || item._id,
            name: item.name,
            image: item.image || "https://via.placeholder.com/60x60",
            code: item.sku || `SP${item.id}`,
            price: item.price || 0,
            sold: item.soldQuantity || 0,
            category: item.category?.name || "Chưa phân loại",
            rating: item.rating || 0,
            featured: item.featured || false,
            status: item.status || "active",
          }));
        } else if (response && Array.isArray(response)) {
          // Cấu trúc cũ 3
          fetchedProducts = response.map((item: any) => ({
            id: item.id || item._id,
            name: item.name,
            image: item.image || "https://via.placeholder.com/60x60",
            code: item.sku || `SP${item.id}`,
            price: item.price || 0,
            sold: item.soldQuantity || 0,
            category: item.category?.name || "Chưa phân loại",
            rating: item.rating || 0,
            featured: item.featured || false,
            status: item.status || "active",
          }));
        }

        // Log fetchedProducts để kiểm tra
        console.log("Processed products:", fetchedProducts);

        setProducts(fetchedProducts);

        // Cập nhật categories dựa trên cấu trúc API thực tế
        if (
          response &&
          response.data &&
          response.data.productCategories &&
          Array.isArray(response.data.productCategories)
        ) {
          const fetchedCategories = response.data.productCategories.map(
            (cat: any) => ({
              id: cat.id,
              name: cat.name,
            })
          );
          setCategories(fetchedCategories);
        } else if (
          response &&
          response.productCategories &&
          Array.isArray(response.productCategories)
        ) {
          const fetchedCategories = response.productCategories.map(
            (cat: any) => ({
              id: cat.id,
              name: cat.name,
            })
          );
          setCategories(fetchedCategories);
        } else if (
          response &&
          response.categories &&
          Array.isArray(response.categories)
        ) {
          // Trường hợp API trả về data trong response.categories
          const fetchedCategories = response.categories.map((cat: any) => ({
            id: cat.id || cat._id,
            name: cat.name,
          }));
          setCategories(fetchedCategories);
        } else {
          // Đặt categories là mảng rỗng
          setCategories([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        message.error("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setProducts([]);
        setTotal(0);
        setCategories([]);
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

  // Xử lý xóa sản phẩm
  const handleDelete = async (id: string) => {
    try {
      // Cần implement API xóa sản phẩm
      // await deleteProduct(id);

      // Tạm thời cập nhật UI
      setProducts(products.filter((product) => product.id !== id));
      message.success("Xóa sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Không thể xóa sản phẩm");
    }
  };

  // Định dạng giá
 

  // Columns của Table
  const columns = [
    {
      title: "Tên SP",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Product) => (
        <div className="product-name-cell">
          <Image
            src={record.image}
            alt={text}
            width={60}
            height={60}
            className="product-image"
            preview={false}
          />
          <div className="product-info">
            <div className="product-title">{text}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatPrice(price),
    },
    {
      title: "SL đã bán",
      dataIndex: "sold",
      key: "sold",
    },
    {
      title: "Danh mục sản phẩm",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <Tag color="blue" className="status-tag">
          Mới
        </Tag>
      ),
    },
    {
      title: "Nổi bật",
      dataIndex: "featured",
      key: "featured",
      render: (featured: boolean) => (
        <Tag color="red" className="status-tag">
          Tắt
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color="green" className="status-tag">
          Hiển thị
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              className="override-delete-btn"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-product-list">
      {/* Filter và Actions */}
      <Card className="filter-card">
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={12} md={6}>
            <div className="search-label" style={{ marginBottom: "8px" }}>
              Tìm kiếm
            </div>
            <Input
              placeholder="Nhập tên sản phẩm"
              value={filterOptions.search}
              onChange={(e) =>
                setFilterOptions({ ...filterOptions, search: e.target.value })
              }
              className="search-input"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="search-label" style={{ marginBottom: "8px" }}>
              Loại sản phẩm
            </div>
            <Select
              placeholder="Chọn loại sản phẩm"
              value={filterOptions.category}
              onChange={(value) =>
                setFilterOptions({ ...filterOptions, category: value })
              }
              className="category-select"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={12}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <Space className="action-buttons" wrap>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                className="override-ant-btn"
              >
                Tìm kiếm
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="override-ant-btn"
                onClick={() => (window.location.href = "/admin/products/add")}
              >
                Thêm mới
              </Button>
              <Button
                type="primary"
                icon={<ImportOutlined />}
                className="override-ant-btn"
              >
                Nhập sản phẩm
              </Button>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                className="override-ant-btn"
              >
                Xuất sản phẩm
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table Products */}
      <Card className="table-card">
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="products-table"
        />

        <div className="pagination-container">
          <div className="pagination-info">Tổng {total} dòng</div>
          <Pagination
            current={filterOptions.page}
            pageSize={filterOptions.pageSize}
            total={total}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
            className="pagination"
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminProductList;
