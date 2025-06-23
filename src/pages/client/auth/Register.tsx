import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../../../api/customerApi";

const Register = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    const data = {
      customer: {
        phone,
        password,
        fullName: "Khách hàng mới", // Bạn có thể thêm input nếu muốn
        gender: "UNKNOWN",
      },
      refCustomerId: 0,
    };

    try {
      await registerCustomer(data);
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-4">
      <div className="w-full max-w-md">
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/" className="text-green-600 hover:underline">
            Trang chủ
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800 font-semibold">Đăng ký tài khoản</span>
        </nav>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-green-50 px-8 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Đăng ký</h2>
            <p className="text-sm text-gray-600 mt-1">
              Tạo tài khoản mới để bắt đầu mua sắm
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  <span className="text-red-600">*</span> Số điện thoại
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  <span className="text-red-600">*</span> Mật khẩu
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  <span className="text-red-600">*</span> Nhập lại mật khẩu
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? "Đang đăng ký..." : "Đăng ký ngay"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-600">Đã có tài khoản? </span>
              <Link
                to="/login"
                className="text-green-600 font-medium hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
