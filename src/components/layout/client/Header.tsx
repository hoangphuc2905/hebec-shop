import { HeartOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png"; // Đảm bảo đường dẫn đúng đến logo

const Header = () => {
  return (
    <header className="w-full shadow-sm">
      {/* Top header */}
      <div className="flex justify-between items-center px-8 py-3 bg-white">
        <img src={logo} alt="Hebec Logo" className="h-10" />

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
          <div className="flex gap-4 items-center text-white text-lg">
            <div className="relative">
              <Link to="/cart">
                <HeartOutlined />
                <span className="absolute -top-2 -right-2 bg-white text-green-600 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
            <Link to="/login">
              <UserOutlined className="hover:text-gray-300 transition" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
