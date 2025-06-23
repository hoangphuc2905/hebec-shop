import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";

// Client pages (import các trang client khi bạn tạo chúng)
import HomePage from "./pages/client/home/Home";
import ProductsPage from "./pages/client/product/ProductList";
import ProductDetailPage from "./pages/client/product/ProductDetail";
import CartPage from "./pages/client/cart/Cart";
import LoginPage from "./pages/client/auth/Login";
import RegisterPage from "./pages/client/auth/Register";
import OderPage from "./pages/client/order/Order";

// Admin pages (import các trang admin khi bạn tạo chúng)
// import AdminDashboard from "./pages/admin/Dashboard";
// import AdminProducts from "./pages/admin/Products";
// import AdminLogin from "./pages/admin/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          {/* Thêm các routes khác cho client khi bạn tạo các components */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="order" element={<OderPage />} />
          {/* Thêm các routes khác nếu cần */}
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div>Admin Dashboard</div>} />
          {/* Thêm các routes khác cho admin khi bạn tạo các components */}
          {/* <Route path="products" element={<AdminProducts />} /> */}
        </Route>

        {/* Route mặc định - chuyển hướng về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
