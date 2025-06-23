import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/layout/admin/Header";
import Sidebar from "../components/layout/admin/Sidebar";
import "./AdminLayout.css";

const { Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="admin-layout">
      <Sidebar collapsed={collapsed} />
      <Layout className={`site-layout ${collapsed ? "collapsed" : ""}`}>
        <AdminHeader collapsed={collapsed} toggle={toggleSidebar} />
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
