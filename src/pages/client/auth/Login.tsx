import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";

const Login = () => {
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
          {/* Header */}
          <div className="bg-green-50 px-8 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
            <p className="text-sm text-gray-600 mt-1">
              Đăng nhập để truy cập tài khoản của bạn
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Tên tài khoản
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên tài khoản"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center"></div>
                <a href="#" className="text-sm text-green-600 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
              >
                Đăng nhập
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">
                Hoặc tiếp tục với
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Social login */}
            <div className="flex justify-center">
              <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors duration-200 w-full max-w-xs">
                <FaFacebook className="text-xl" />
                <span>Facebook</span>
              </button>
            </div>

            {/* Register link */}
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
