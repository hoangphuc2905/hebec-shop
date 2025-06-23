import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginCustomer } from "../../../api/customerApi";
import { message } from "antd";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let formattedPhone = phone;
    if (phone.startsWith("0")) {
      formattedPhone = "84" + phone.slice(1);
    }

    try {
      const res = await loginCustomer({
        phone: formattedPhone,
        password,
      });

      if (res?.data?.token) {
        localStorage.setItem("token", res.data.token);

        window.dispatchEvent(new Event("login-success"));

        message.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        message.error(
          "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin."
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(`Lỗi: ${err.message}`);
      } else {
        message.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-4">
      <div className="w-full max-w-md">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/" className="text-green-600 hover:underline">
            Trang chủ
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800 font-semibold">Tài khoản</span>
        </nav>

        {/* Login box */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-green-50 px-8 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
            <p className="text-sm text-gray-600 mt-1">
              Đăng nhập để truy cập tài khoản của bạn
            </p>
          </div>

          <div className="p-8">
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-600">Chưa có tài khoản? </span>
              <Link
                to="/register"
                className="text-green-600 font-medium hover:underline"
              >
                Đăng ký mới
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
