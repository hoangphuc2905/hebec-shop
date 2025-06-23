import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-4">
      <div className="w-full max-w-md">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/" className="text-green-600 hover:underline">
            Trang chủ
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-800 font-semibold">Đăng ký tài khoản</span>
        </nav>

        {/* Register box */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-green-50 px-8 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Đăng ký</h2>
            <p className="text-sm text-gray-600 mt-1">
              Tạo tài khoản mới để bắt đầu mua sắm
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  <span className="text-red-600">*</span> Số điện thoại (tên
                  đăng nhập)
                </label>
                <input
                  type="text"
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
                  placeholder="Nhập lại mật khẩu"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
              >
                Đăng ký ngay
              </button>
            </form>

            {/* Register link */}
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
