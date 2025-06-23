import { Outlet } from "react-router-dom";
// import AdminHeader from "../components/admin/Header";
// import AdminSidebar from "../components/admin/Sidebar";
import { Layout } from "antd";

const { Content, Footer } = Layout;

function AdminLayout() {
  return (
    <Layout className="min-h-screen">
      {/* <AdminSidebar /> */}
      <Layout>
        {/* <AdminHeader /> */}
        <Content className="p-6">
          <Outlet />
        </Content>
        <Footer className="text-center">
          Hebec Shop Admin ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
