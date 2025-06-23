import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 text-sm mt-16 border-t">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Cột 1: Logo và mô tả */}
        <div className="space-y-2">
          <img src={logo} alt="Hebec Logo" className="h-10" />
          <p className="font-semibold text-gray-800">
            CÔNG TY CỔ PHẦN SÁCH VÀ THIẾT BỊ GIÁO DỤC HẢI DƯƠNG
          </p>
        </div>

        {/* Cột 2: Về chúng tôi */}
        <div>
          <h4 className="font-semibold mb-2">Về chúng tôi</h4>
          <ul className="space-y-1">
            <li>
              <Link to="#">Giới thiệu HEBEC</Link>
            </li>
            <li>
              <Link to="#">Điều khoản sử dụng</Link>
            </li>
            <li>
              <Link to="#">Các vấn đề thường gặp</Link>
            </li>
            <li>
              <Link to="#">Chính sách bảo mật</Link>
            </li>
            <li>
              <Link to="#">Chính sách đổi - trả - hoàn tiền</Link>
            </li>
            <li>
              <Link to="#">Phương thức thanh toán</Link>
            </li>
            <li>
              <Link to="#">Phương thức vận chuyển</Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Tiện ích */}
        <div>
          <h4 className="font-semibold mb-2">Tiện ích</h4>
          <ul className="space-y-1">
            <li>
              <Link to="#">Tin tức</Link>
            </li>
            <li>
              <Link to="#">Sản phẩm yêu thích</Link>
            </li>
            <li>
              <Link to="#">Đơn hàng của bạn</Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Liên kết */}
        <div>
          <h4 className="font-semibold mb-2">Liên kết</h4>
          <ul className="space-y-1">
            <li>
              <Link to="#">Theo dõi chúng tôi trên</Link>
            </li>
            {/* Thêm icon social ở đây nếu cần */}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t text-center text-xs py-4 text-gray-500">
        Designed by{" "}
        <span className="text-green-600 font-medium">BMD Solutions</span> —
        Copyright <span className="text-green-600 font-medium">Hebec</span> —
        Version 1.0.21
      </div>
    </footer>
  );
};

export default Footer;
