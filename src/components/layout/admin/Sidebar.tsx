import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  RocketOutlined,
  UserOutlined,
  SoundOutlined,
  SettingOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import "./Sidebar.css";
import logo from "../../../assets/logo.png";

const { Sider } = Layout;

// Hàm tạo menu item đúng chuẩn
type MenuItem = Required<MenuProps>["items"][number];
const getItem = (
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem => ({
  key,
  icon,
  children,
  label,
});

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Lấy path hiện tại
  const currentPath = location.pathname;

  // Mapping giữa key và route - SỬA ĐỂ ĐÚNG VỚI ROUTE THỰC TẾ TRONG APP.TSX
  const routeMapping: Record<string, string> = {
    dashboard: "/admin",
    orders: "/admin/orders",
    "product-list": "/admin/products",
    products: "/admin/products",
    "product-categories": "/admin/product-categories",
    "product-import": "/admin/product-import",
    campaigns: "/admin/campaigns",
    promotions: "/admin/promotions",
    "flash-sales": "/admin/flash-sales",
    // Sửa route mapping cho danh sách khách hàng
    customers: "/admin/customers",
    "customer-list": "/admin/customers", // Sửa route này để đúng với App.tsx
    "customer-groups": "/admin/customer-groups",
    marketing: "/admin/marketing",
    notifications: "/admin/notifications",
    banners: "/admin/banners",
    configuration: "/admin/configuration",
    settings: "/admin/settings",
    staff: "/admin/staff",
    roles: "/admin/roles",
    stores: "/admin/stores",
    "store-list": "/admin/store-list",
    "store-settings": "/admin/store-settings",
  };

  // Xác định selected key dựa trên URL hiện tại
  const findSelectedKey = () => {
    // Tìm key phù hợp nhất dựa trên URL hiện tại
    let bestMatch = "";
    let bestMatchLength = 0;

    Object.entries(routeMapping).forEach(([key, route]) => {
      if (currentPath.startsWith(route) && route.length > bestMatchLength) {
        bestMatch = key;
        bestMatchLength = route.length;
      }
    });

    return bestMatch || "dashboard";
  };

  const selectedKey = findSelectedKey();

  // Xác định parent keys để mở rộng submenu chứa item được chọn
  useEffect(() => {
    const parentKeys: string[] = [];

    // Xác định key của parent menu khi một submenu item được chọn
    // Example: Nếu 'product-list' được chọn, thêm 'products' vào openKeys
    if (
      selectedKey === "product-list" ||
      selectedKey === "product-categories" ||
      selectedKey === "product-import"
    ) {
      parentKeys.push("products");
    } else if (selectedKey === "promotions" || selectedKey === "flash-sales") {
      parentKeys.push("campaigns");
    } else if (
      selectedKey === "customer-list" ||
      selectedKey === "customer-groups"
    ) {
      parentKeys.push("customers");
    } else if (selectedKey === "notifications" || selectedKey === "banners") {
      parentKeys.push("marketing");
    } else if (
      selectedKey === "settings" ||
      selectedKey === "staff" ||
      selectedKey === "roles"
    ) {
      parentKeys.push("configuration");
    } else if (
      selectedKey === "store-list" ||
      selectedKey === "store-settings"
    ) {
      parentKeys.push("stores");
    }

    // Nếu không collapse, mở submenu chứa item được chọn
    if (!collapsed && parentKeys.length > 0) {
      setOpenKeys(parentKeys);
    }
  }, [selectedKey, collapsed]);

  // Danh sách menu
  const menuItems: MenuItem[] = [
    getItem("Dashboard", "dashboard", <DashboardOutlined />),
    getItem("Đơn hàng", "orders", <ShoppingCartOutlined />),
    getItem("Sản phẩm", "products", <ShoppingOutlined />, [
      getItem("Danh sách sản phẩm", "product-list"),
      getItem("Danh mục sản phẩm", "product-categories"),
      getItem("Nhập hàng", "product-import"),
    ]),
    getItem("Chiến dịch", "campaigns", <RocketOutlined />, [
      getItem("Khuyến mãi", "promotions"),
      getItem("Flash Sale", "flash-sales"),
    ]),
    getItem("Khách hàng", "customers", <UserOutlined />, [
      getItem("Danh sách khách hàng", "customer-list"),
      getItem("Nhóm khách hàng", "customer-groups"),
    ]),
    getItem("Truyền thông", "marketing", <SoundOutlined />, [
      getItem("Thông báo", "notifications"),
      getItem("Banners", "banners"),
    ]),
    getItem("Cấu hình", "configuration", <SettingOutlined />, [
      getItem("Thiết lập chung", "settings"),
      getItem("Nhân viên", "staff"),
      getItem("Phân quyền", "roles"),
    ]),
    getItem("Quản lý cửa hàng", "stores", <ShopOutlined />, [
      getItem("Danh sách cửa hàng", "store-list"),
      getItem("Cài đặt cửa hàng", "store-settings"),
    ]),
  ];

  // Xử lý click vào menu
  const handleMenuClick = ({ key }: { key: string }) => {
    // Sử dụng mapping để điều hướng đến đúng route
    const route = routeMapping[key];
    if (route) {
      navigate(route);
    }
  };

  // Xử lý khi mở/đóng submenu
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={230}
      className="admin-sidebar"
    >
      {!collapsed && (
        <div className="sidebar-logo-container">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
      )}

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        items={menuItems}
        className="sidebar-menu"
      />
    </Sider>
  );
};

export default Sidebar;
