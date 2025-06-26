/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Tabs,
  Form,
  Input,
  Button,
  Avatar,
  Spin,
  Table,
  Tag,
  Modal,
  message,
  Space,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  LockOutlined,
  ShoppingOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { getCustomerProfile } from "../../../api/customerApi";
import { getCustomerOrderList } from "../../../api/orderApi";
import type { Customer } from "../../../types/interfaces/customer.interface";
import type { Order } from "../../../types/interfaces/order.interface";
import "../../../styles/override.css";
import { formatDateString } from "../../../utils/date";
import { formatPrice } from "../../../utils/money";

const { TabPane } = Tabs;

const Profile: React.FC = () => {
  const [user, setUser] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [passwordModalVisible, setPasswordModalVisible] =
    useState<boolean>(false);
  const [orderDetailModalVisible, setOrderDetailModalVisible] =
    useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await getCustomerOrderList();

      if (response?.data?.orders) {
        setOrders(response.data.orders);
        setFilteredOrders(response.data.orders);
      } else {
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      console.error("Không thể lấy danh sách đơn hàng:", error);
      message.error("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Hàm tìm kiếm đơn hàng sử dụng API
  const handleSearch = async (value: string) => {
    setSearchText(value);
    setLoadingOrders(true);
    try {
      const response = await getCustomerOrderList({ search: value });
      if (response?.data?.orders) {
        setFilteredOrders(response.data.orders);
      } else {
        setFilteredOrders([]);
      }
    } catch (error) {
      setFilteredOrders([]);
      message.error("Không thể tìm kiếm đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Reset tìm kiếm
  const handleResetSearch = () => {
    setSearchText("");
    setFilteredOrders(orders);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error("Vui lòng đăng nhập để xem thông tin tài khoản");
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getCustomerProfile();

        if (response?.data) {
          const userData = response.data;
          setUser(userData);

          profileForm.setFieldsValue({
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
          });
        }
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
        message.error(
          "Không thể tải thông tin người dùng. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
    fetchOrders();
  }, [profileForm, navigate]);

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailModalVisible(true);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { text: "Chờ xác nhận", color: "orange" };
      case "CONFIRM":
        return { text: "Đã xác nhận", color: "gold" };
      case "PROCESSING":
        return { text: "Đang xử lý", color: "blue" };
      case "SHIPPED":
        return { text: "Đang giao hàng", color: "cyan" };
      case "DELIVERING":
        return { text: "Đã giao hàng", color: "green" };
      case "COMPLETE":
        return { text: "Hoàn thành", color: "success" };
      case "CANCELLED":
        return { text: "Đã hủy", color: "red" };
      case "RETURNED":
        return { text: "Đã trả hàng", color: "purple" };
      case "REFUNDED":
        return { text: "Đã hoàn tiền", color: "geekblue" };
      default:
        return { text: status, color: "default" };
    }
  };


  const orderColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <span className="font-medium">#{code}</span>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (timestamp: number) => formatDateString(timestamp),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (amount: number) => (
        <span className="font-medium">{formatPrice(amount)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const { text, color } = getStatusInfo(status);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Order) => (
        <Button
          type="link"
          onClick={() => showOrderDetail(record)}
          icon={<ShoppingOutlined />}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Hiển thị loading khi đang tải thông tin
  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải thông tin tài khoản..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Add custom styles */}
      <style>
        {`
          .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #16a34a !important;
          }
          .ant-tabs-ink-bar {
            background: #16a34a !important;
          }
          .ant-tabs-tab:hover .ant-tabs-tab-btn {
            color: #16a34a !important;
          }
        `}
      </style>

      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="list-none p-0 flex flex-wrap items-center">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-green-600">
              Trang chủ
            </Link>
            <span className="mx-2 text-gray-400">›</span>
          </li>
          <li className="flex items-center text-gray-800">Tài khoản của tôi</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold mb-6">Tài khoản của tôi</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
          <div className="mb-4 sm:mb-0 sm:mr-8">
            <Avatar
              size={100}
              src={user?.avatar}
              icon={!user?.avatar && <UserOutlined />}
              className="border-2 border-gray-200"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.fullName}</h2>
            <p className="text-gray-500">{user?.email}</p>
            {user?.phone && <p className="text-gray-500">{user.phone}</p>}
          </div>
        </div>

        <Tabs defaultActiveKey="profile">
          <TabPane
            tab={
              <span className="flex items-center">
                <UserOutlined className="mr-2" />
                Thông tin tài khoản
              </span>
            }
            key="profile"
          >
            <Form
              form={profileForm}
              layout="vertical"
              // onFinish={handleProfileUpdate}
              className="max-w-lg"
            >
              <Form.Item
                name="fullName"
                label="Họ tên"
                // rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Họ tên"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="Số điện thoại"
                />
              </Form.Item>

              <Form.Item name="address" label="Địa chỉ">
                <Input
                  prefix={<HomeOutlined className="text-gray-400" />}
                  placeholder="Địa chỉ"
                />
              </Form.Item>

              <Form.Item>
                <div className="flex justify-between"></div>
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span className="flex items-center">
                <ShoppingOutlined className="mr-2" />
                Lịch sử đơn hàng
              </span>
            }
            key="orders"
          >
            {loadingOrders ? (
              <div className="text-center py-10">
                <Spin tip="Đang tải đơn hàng..." />
              </div>
            ) : orders.length > 0 ? (
              <div>
                {/* Thanh tìm kiếm */}
                <div className="mb-4">
                  <Space.Compact style={{ width: "100%", maxWidth: 400 }}>
                    <Input
                      placeholder="Tìm kiếm theo mã đơn hàng..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)} // chỉ set state, không gọi API
                      prefix={<SearchOutlined className="text-gray-400" />}
                      allowClear
                      onClear={handleResetSearch}
                    />
                    <Button
                      type="primary"
                      className="override-ant-btn"
                      onClick={() => handleSearch(searchText)}
                    >
                      Tìm kiếm
                    </Button>
                  </Space.Compact>
                </div>

                {/* Bảng đơn hàng */}
                <Table
                  columns={orderColumns}
                  dataSource={filteredOrders}
                  rowKey="id"
                  pagination={{
                    pageSize: 5,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  }}
                  locale={{
                    emptyText: searchText
                      ? `Không tìm thấy đơn hàng nào với mã "${searchText}"`
                      : "Không có đơn hàng nào",
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-10">
                <ShoppingOutlined
                  style={{ fontSize: "48px" }}
                  className="text-gray-300 mb-4"
                />
                <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                <Link to="/san-pham">
                  <Button
                    type="primary"
                    className="mt-4 bg-green-600 hover:bg-green-700"
                  >
                    Mua sắm ngay
                  </Button>
                </Link>
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>

      {/* Password Change Modal */}
      <Modal
        title="Đổi mật khẩu"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          // onFinish={handlePasswordChange}
        >
          <Form.Item
            name="currentPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end">
              <Button
                onClick={() => setPasswordModalVisible(false)}
                className="mr-2"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-green-600 hover:bg-green-700"
              >
                Cập nhật mật khẩu
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Order Detail Modal */}
      <Modal
        title="Chi tiết đơn hàng"
        open={orderDetailModalVisible}
        onCancel={() => setOrderDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <div>
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold">#{selectedOrder.code}</h3>
                  <p className="text-sm text-gray-500">
                    Ngày đặt: {formatDateString(selectedOrder.createdAt)}
                  </p>
                </div>
                <Tag color={getStatusInfo(selectedOrder.status).color}>
                  {getStatusInfo(selectedOrder.status).text}
                </Tag>
              </div>
            </div>

            <h4 className="font-medium mb-2">Sản phẩm</h4>
            <div className="border rounded-md overflow-hidden mb-4">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-2 px-3">Sản phẩm</th>
                    <th className="text-right py-2 px-3">Giá</th>
                    <th className="text-center py-2 px-3">SL</th>
                    <th className="text-right py-2 px-3">Tổng</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedOrder.details.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-3">
                        <div className="flex items-center">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover mr-3"
                          />
                          <span>{item.product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {formatPrice(item.finalPrice)}
                      </td>
                      <td className="py-3 px-3 text-center">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-medium">
                        {formatPrice(item.finalPrice * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between">
              <div className="w-1/2">
                <h4 className="font-medium mb-2">Thông tin giao hàng</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p>
                    <strong>Người nhận:</strong> {selectedOrder.receiverName}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {selectedOrder.receiverPhone}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {selectedOrder.receiverAddress}
                  </p>
                </div>
              </div>

              <div className="w-5/12">
                <h4 className="font-medium mb-2">Tổng thanh toán</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between py-1">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(selectedOrder.subTotalMoney)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(selectedOrder.shipFee)}</span>
                  </div>
                  <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">
                      {formatPrice(selectedOrder.totalMoney)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {selectedOrder.status === "PENDING" && (
              <div className="mt-4 flex justify-end">
                <Button
                  danger
                  // onClick={() => handleCancelOrder(selectedOrder.id)}
                >
                  Hủy đơn hàng
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Profile;
