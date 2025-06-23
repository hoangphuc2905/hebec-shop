import React, { useState } from "react";
import { Layout, Button, Switch, Badge, Dropdown, Avatar, Space } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Header.css";

// Import logo
import logo from "../../../assets/logo.png";

interface AdminHeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

const { Header } = Layout;

const AdminHeader: React.FC<AdminHeaderProps> = ({ collapsed, toggle }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const navigate = useNavigate();

  const namespace = localStorage.getItem("adminNamespace") || "hoangphuc";
  const notificationCount = 2;

  const userMenuItems = [
    {
      key: "profile",
      label: "Thông tin tài khoản",
      icon: <UserOutlined />,
      onClick: () => navigate("/admin/profile"),
    },
    {
      key: "settings",
      label: "Cài đặt",
      icon: <SettingOutlined />,
      onClick: () => navigate("/admin/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: () => handleLogout(),
    },
  ];

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminNamespace");
    navigate("/admin/login");
  };

  return (
    <Header className="admin-header">
      <div className="admin-header-left">
        <div className="admin-logo"></div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggle}
          className="admin-trigger-button"
        />
      </div>

      <div className="admin-header-right">
        <div className="notification-switch">
          <span>Bật thông báo đẩy</span>
          <Switch
            checked={notificationsEnabled}
            onChange={setNotificationsEnabled}
            size="small"
          />
        </div>

        <Badge count={notificationCount} size="small">
          <Button
            type="text"
            icon={<BellOutlined />}
            className="notification-button"
          />
        </Badge>

        <div className="admin-version">v0.0.89</div>

        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <Space className="admin-user">
            <div className="admin-user-button">
              {namespace === "hoangphuc" ? "Hoàng Phúc" : namespace}
            </div>
            <Avatar size={36} src={logo} className="admin-avatar" />
            <DownOutlined style={{ fontSize: 12 }} />
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AdminHeader;
