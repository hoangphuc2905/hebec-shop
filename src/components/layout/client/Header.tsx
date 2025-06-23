import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  LogoutOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Avatar, message, Spin, Modal } from "antd";
import type { MenuProps } from "antd";
import logo from "../../../assets/logo.png";
import { getCustomerProfile } from "../../../api/customerApi";
import { logoutCustomer } from "../../../api/customerApi";
import type { Customer } from "../../../types/interfaces/customer.interface";

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
  const [user, setUser] = useState<Customer | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0); // New state for cart count
  const [token] = useToken("token");
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartData = localStorage.getItem("cart");
        if (cartData) {
          const cartItems = JSON.parse(cartData);
          setCartCount(cartItems.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Error reading cart data:", error);
        setCartCount(0);
      }
    };

    updateCartCount();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        updateCartCount();
      }
    };

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
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
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        } finally {
          setLoading(false);
        }
      } else {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
          } catch (error) {
            console.error("Lỗi khi phân tích dữ liệu người dùng:", error);
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
  }, [token]); 

  useEffect(() => {
    const handleLoginSuccess = () => {
      fetchUserProfile();
    };

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
      {/* Top header - white background */}
      <div className="container mx-auto px-16 py-4 bg-white flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Hebec Logo" className="h-10" />
          </Link>
        </div>

        <div className="flex items-center">
          <span className="text-sm text-gray-500">Liên hệ tổng đài</span>
        </div>
      </div>

      {/* Menu navigation - green background */}
      <nav className="bg-green-600 text-white">
        <div className="container mx-auto px-8 flex justify-between items-center h-14">
          {/* Menu chính - căn giữa */}
          <div className="flex-1 flex justify-center h-full">
            <ul className="flex gap-6 text-sm font-bold h-full items-center">
              <li className="h-full flex items-center">
                <Link
                  to="/"
                  className="px-2 flex items-center h-full hover:text-gray-200 transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li className="h-full flex items-center">
                <Link
                  to="/products"
                  className="px-2 flex items-center h-full hover:text-gray-200 transition-colors"
                >
                  Hebec Shop
                </Link>
              </li>
              <li className="relative group h-full flex items-center">
                <button className="px-2 focus:outline-none hover:text-gray-200 transition-colors flex items-center h-full">
                  Danh mục sản phẩm ▾
                </button>
              </li>
              <li className="relative group h-full flex items-center">
                <button className="px-2 focus:outline-none hover:text-gray-200 transition-colors flex items-center h-full">
                  Danh mục đồng phục ▾
                </button>
              </li>
              <li className="h-full flex items-center">
                <Link
                  to="/tin-tuc"
                  className="px-2 flex items-center h-full hover:text-gray-200 transition-colors"
                >
                  Tin tức
                </Link>
              </li>
              <li className="h-full flex items-center">
                <Link
                  to="/lien-he"
                  className="px-2 flex items-center h-full hover:text-gray-200 transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li className="relative group h-full flex items-center">
                <button className="px-2 focus:outline-none hover:text-gray-200 transition-colors flex items-center h-full">
                  Về chúng tôi ▾
                </button>
              </li>
            </ul>
          </div>

          {/* User và giỏ hàng - bên phải */}
          <div className="flex gap-4 items-center h-full">
            <div className="relative">
              <Link to="/cart">
                <ShoppingCartOutlined className="text-lg text-white hover:text-gray-200 transition-colors" />
                <span className="absolute -top-2 -right-2 bg-white text-green-600 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
            </div>

            {loading ? (
              <Spin size="small" />
            ) : isLoggedIn && user ? (
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="flex items-center cursor-pointer h-full">
                  <span className="mr-2 text-sm text-white">
                    {user.fullName}
                  </span>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                    className="bg-white text-green-600"
                  />
                </div>
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-white hover:text-gray-200 transition h-full"
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  className="bg-white text-green-600"
                />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
