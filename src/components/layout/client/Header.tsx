import React, { useState, useEffect } from "react";
import {
  HeartOutlined,
  UserOutlined,
  LogoutOutlined,
  FileTextOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Menu, Avatar, message, Spin, Modal } from "antd";
import type { MenuProps } from "antd";
import logo from "../../../assets/logo.png";
import { getCustomerProfile } from "../../../api/customerApi";
import { logoutCustomer } from "../../../api/customerApi";

// Interface cho thông tin người dùng
interface User {
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// Custom hook để lắng nghe token trong localStorage
const useToken = (key: string) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  useEffect(() => {
    // Lắng nghe sự kiện storage từ các tab/window khác
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setToken(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [token, setToken];
};

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  // Sử dụng custom hook để theo dõi token
  const [token] = useToken("token");
  const navigate = useNavigate();

  // Được gọi lại khi token thay đổi
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          setLoading(true);
          // Gọi API lấy thông tin profile với token
          const profileResponse = await getCustomerProfile();

          if (profileResponse && profileResponse.data) {
            // Lưu thông tin user vào state và localStorage
            const userData = profileResponse.data;
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Không thể lấy thông tin người dùng:", error);
          // Nếu có lỗi, xóa token
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        } finally {
          setLoading(false);
        }
      } else {
        // Kiểm tra nếu có dữ liệu người dùng trong localStorage
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
          } catch (e) {
            localStorage.removeItem("user");
            setIsLoggedIn(false);
          }
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    };

    fetchUserProfile();
  }, [token]); // Chạy lại khi token thay đổi

  // Thêm listener cho sự kiện tùy chỉnh 'login-success'
  useEffect(() => {
    const handleLoginSuccess = () => {
      // Tải lại thông tin người dùng
      fetchUserProfile();
    };

    // Hàm để tải thông tin người dùng
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const profileResponse = await getCustomerProfile();

        if (profileResponse && profileResponse.data) {
          const userData = profileResponse.data;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener("login-success", handleLoginSuccess);
    return () => {
      window.removeEventListener("login-success", handleLoginSuccess);
    };
  }, []);

  const handleLogout = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn đăng xuất?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          setLoading(true);
          // Gọi API logout
          await logoutCustomer();

          // Sau khi logout thành công, xóa dữ liệu cục bộ
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setIsLoggedIn(false);

          message.success("Đăng xuất thành công!");
          navigate("/");
        } catch (error) {
          console.error("Lỗi khi đăng xuất:", error);
          message.error("Đăng xuất thất bại. Vui lòng thử lại sau.");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Menu dropdown cho người dùng đã đăng nhập (cập nhật theo cách mới của Ant Design v5)
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to="/profile">Thông tin cá nhân</Link>,
    },
    {
      key: "orders",
      icon: <FileTextOutlined />,
      label: <Link to="/tai-khoan?tab=orders">Lịch sử đơn hàng</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <header className="w-full shadow-sm">
      {/* Top header */}
      <div className="flex justify-between items-center px-8 py-3 bg-white">
        <Link to="/">
          <img src={logo} alt="Hebec Logo" className="h-10" />
        </Link>

        <span className="text-sm text-gray-500">Liên hệ tổng đài</span>
      </div>

      {/* Menu */}
      <nav className="bg-green-600 text-white px-8">
        <div className="flex justify-between items-center h-12">
          {/* Left menu */}
          <ul className="flex gap-6 text-sm font-semibold">
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/products">Hebec Shop</Link>
            </li>
            <li className="relative group">
              <button className="focus:outline-none">
                Danh mục sản phẩm ▾
              </button>
              {/* Dropdown nếu cần */}
            </li>
            <li className="relative group">
              <button className="focus:outline-none">
                Danh mục đồng phục ▾
              </button>
            </li>
            <li>
              <Link to="/tin-tuc">Tin tức</Link>
            </li>
            <li>
              <Link to="/lien-he">Liên hệ</Link>
            </li>
            <li className="relative group">
              <button className="focus:outline-none">Về chúng tôi ▾</button>
            </li>
          </ul>

          {/* Right icons */}
          <div className="flex gap-4 items-center text-white">
            <div className="relative">
              <Link to="/cart">
                <HeartOutlined className="text-lg" />
                <span className="absolute -top-2 -right-2 bg-white text-green-600 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>

            {loading ? (
              <Spin size="small" />
            ) : isLoggedIn && user ? (
              <div className="flex items-center">
                <Dropdown
                  menu={{ items: userMenuItems }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <div className="flex items-center cursor-pointer">
                    <span className="mr-2 text-sm">{user.fullName}</span>
                    {user.avatar ? (
                      <Avatar size="small" src={user.avatar} />
                    ) : (
                      <Avatar size="small" icon={<UserOutlined />} />
                    )}
                  </div>
                </Dropdown>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center hover:text-gray-300 transition"
              >
                <UserOutlined className="text-lg" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
