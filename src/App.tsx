import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";

// Client pages
import HomePage from "./pages/client/home/Home";
import ProductsPage from "./pages/client/product/ProductList";
import ProductDetailPage from "./pages/client/product/ProductDetail";
import CartPage from "./pages/client/cart/Cart";
import LoginPage from "./pages/client/auth/Login";
import RegisterPage from "./pages/client/auth/Register";
import OderPage from "./pages/client/order/Order";
import ProfilePage from "./pages/client/profile/Profile";

// Admin pages
// import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/product/ProductList";
import AdminLogin from "./pages/admin/auth/Login";
import CustomerPage from "./pages/admin/customer/CustomerList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="order" element={<OderPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Login - đặt độc lập không dùng layout */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Các trang Admin khác - có header và sidebar */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div>Admin Dashboard</div>} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="customers" element={<CustomerPage />} />
        </Route>

        {/* Route mặc định */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
