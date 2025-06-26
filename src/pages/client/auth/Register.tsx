import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../../../api/customerApi";
import type { Customer } from "../../../types/interfaces/customer.interface";
import { message, Select } from "antd";
import { getCities, getDistricts, getWards } from "../../../api/customerApi";

const { Option } = Select;

const Register = () => {
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Địa chỉ động
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getCities().then((res) => setCities(res.data?.cities || []));
  }, []);

  useEffect(() => {
    if (province) {
      setDistrict("");
      setWard("");
      setDistricts([]);
      setWards([]);
      getDistricts(Number(province)).then((res) =>
        setDistricts(res.data?.districts || res.data || [])
      );
    }
  }, [province]);

  useEffect(() => {
    if (district) {
      setWard("");
      setWards([]);
      getWards(Number(district)).then((res) =>
        setWards(res.data?.wards || res.data || [])
      );
    }
  }, [district]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Chỉ cho nhập số, tối đa 11 ký tự (tùy nhu cầu)
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      message.error("Mật khẩu không khớp. Vui lòng kiểm tra lại.");
      return;
    }
    if (!province || !district || !ward) {
      message.error("Vui lòng chọn đầy đủ địa chỉ.");
      return;
    }
    if (!/^\d{10,11}$/.test(phone)) {
      message.error("Số điện thoại không hợp lệ.");
      return;
    }

    setLoading(true);

    const address = `${addressDetail}, ${
      wards.find((w) => w.code === ward)?.nameWithType || ""
    }, ${districts.find((d) => d.code === district)?.nameWithType || ""}, ${
      cities.find((c) => c.code === province)?.nameWithType || ""
    }`;

    const customerData: Partial<Customer> = {
      phone,
      password,
      fullName,
      address,
    };

    const data = {
      customer: customerData,
      refCustomerId: 0,
    };

    try {
      await registerCustomer(data);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(`Lỗi: ${err.message}`);
      } else {
        message.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
      }
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-4">
      <div className="w-full max-w-2xl">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <span className="text-red-600">*</span> Họ tên
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ tên"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <span className="text-red-600">*</span> Số điện thoại
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Nhập số điện thoại"
                    maxLength={11}
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
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  <span className="text-red-600">*</span> Địa chỉ
                </label>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col md:flex-row gap-2">
                    <Select
                      showSearch
                      required
                      value={province || undefined}
                      onChange={(value) => setProvince(value)}
                      placeholder="Tỉnh/Thành phố"
                      className="w-full md:w-1/3 text-sm"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.children as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {cities.map((c) => (
                        <Option key={c.code} value={c.code}>
                          {c.nameWithType}
                        </Option>
                      ))}
                    </Select>
                    <Select
                      showSearch
                      required
                      value={district || undefined}
                      onChange={(value) => setDistrict(value)}
                      placeholder="Quận/Huyện"
                      className="w-full md:w-1/3 text-sm"
                      disabled={!province}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.children as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {districts.map((d) => (
                        <Option key={d.code} value={d.code}>
                          {d.nameWithType}
                        </Option>
                      ))}
                    </Select>
                    <Select
                      showSearch
                      required
                      value={ward || undefined}
                      onChange={(value) => setWard(value)}
                      placeholder="Phường/Xã"
                      className="w-full md:w-1/3 text-sm"
                      disabled={!district}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.children as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {wards.map((w) => (
                        <Option key={w.code} value={w.code}>
                          {w.nameWithType}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <input
                    type="text"
                    required
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    placeholder="Số nhà, tên đường..."
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-md"
                  />
                </div>
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
