import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Radio,
  Divider,
  Steps,
  message,
  Card,
  Spin,
  Select,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  ShopOutlined,
  CheckOutlined,
  LeftOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderFormValues {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  shippingMethod: string;
  paymentMethod: string;
  notes: string;
}

const initialValues: OrderFormValues = {
  fullName: "",
  phone: "",
  email: "",
  province: "",
  district: "",
  ward: "",
  address: "",
  shippingMethod: "standard",
  paymentMethod: "cod",
  notes: "",
};

const Order: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [provinces, setProvinces] = useState<string[]>([
    "Hà Nội",
    "Hồ Chí Minh",
    "Hải Phòng",
    "Đà Nẵng",
    "Hải Dương",
    "Bắc Ninh",
  ]);
  const [districts, setDistricts] = useState<string[]>([
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Huyện A",
    "Huyện B",
  ]);
  const [wards, setWards] = useState<string[]>([
    "Phường 1",
    "Phường 2",
    "Xã A",
    "Xã B",
  ]);

  useEffect(() => {
    // Mô phỏng việc lấy dữ liệu giỏ hàng
    setTimeout(() => {
      setCartItems([
        {
          id: "1",
          name: "143 Món Khai Vị Hấp Dẫn",
          price: 37000,
          quantity: 1,
          image:
            "https://salt.tikicdn.com/cache/280x280/ts/product/45/3b/fc/aa81d0a534b45706ae1eee1e344e80d9.jpg",
        },
        {
          id: "2",
          name: "Trẻ Lâu Đẹp Dáng",
          price: 82000,
          quantity: 2,
          image:
            "https://salt.tikicdn.com/cache/280x280/ts/product/65/ae/44/73256656d447425db7510a9ac5d84a12.jpg",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateShippingFee = () => {
    const shippingMethod = form.getFieldValue("shippingMethod");
    return shippingMethod === "express" ? 30000 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingFee();
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const handleNextStep = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = (values: OrderFormValues) => {
    // Mô phỏng xử lý đặt hàng
    message.loading({ content: "Đang xử lý đơn hàng...", key: "order" });
    
    setTimeout(() => {
      message.success({
        content: "Đặt hàng thành công!",
        key: "order",
        duration: 2,
      });
      // Chuyển hướng đến trang xác nhận đặt hàng thành công
      setTimeout(() => {
        navigate("/order-success");
      }, 1000);
    }, 1500);
  };

  const steps = [
    {
      title: "Thông tin giao hàng",
      icon: <UserOutlined />,
    },
    {
      title: "Phương thức thanh toán",
      icon: <CreditCardOutlined />,
    },
    {
      title: "Xác nhận đơn hàng",
      icon: <CheckOutlined />,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="list-none p-0 flex flex-wrap items-center">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-green-600">
              Trang chủ
            </Link>
            <span className="mx-2 text-gray-400">›</span>
          </li>
          <li className="flex items-center">
            <Link to="/gio-hang" className="text-gray-500 hover:text-green-600">
              Giỏ hàng
            </Link>
            <span className="mx-2 text-gray-400">›</span>
          </li>
          <li className="flex items-center text-gray-800">Đặt hàng</li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Đặt hàng</h1>
      </div>

      {/* Steps */}
      <Steps
        current={currentStep}
        className="mb-8 hidden md:flex"
        items={steps.map((step) => ({
          title: step.title,
          icon: step.icon,
        }))}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="md:col-span-2">
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleFinish}
          >
            {currentStep === 0 && (
              <Card className="mb-6">
                <h2 className="text-lg font-bold mb-4">Thông tin giao hàng</h2>

                <Form.Item
                  name="fullName"
                  label="Họ tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ tên!" },
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined className="text-gray-400" />} 
                    placeholder="Nhập họ tên người nhận" 
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined className="text-gray-400" />}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { type: "email", message: "Email không hợp lệ!" },
                    { required: true, message: "Vui lòng nhập email!" },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Form.Item
                    name="province"
                    label="Tỉnh/Thành phố"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn tỉnh/thành phố!",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn tỉnh/thành phố">
                      {provinces.map((province) => (
                        <Option key={province} value={province}>
                          {province}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="district"
                    label="Quận/Huyện"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn quận/huyện!",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn quận/huyện">
                      {districts.map((district) => (
                        <Option key={district} value={district}>
                          {district}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="ward"
                    label="Phường/Xã"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn phường/xã!",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn phường/xã">
                      {wards.map((ward) => (
                        <Option key={ward} value={ward}>
                          {ward}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  name="address"
                  label="Địa chỉ chi tiết"
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ!" },
                  ]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Số nhà, tên đường..."
                    prefix={<EnvironmentOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  name="shippingMethod"
                  label="Phương thức vận chuyển"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phương thức vận chuyển!",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="standard">
                      <div>
                        <p className="font-medium">Giao hàng tiêu chuẩn</p>
                        <p className="text-sm text-gray-500">
                          Nhận hàng trong 3-5 ngày - Miễn phí
                        </p>
                      </div>
                    </Radio>
                    <Divider className="my-2" />
                    <Radio value="express">
                      <div>
                        <p className="font-medium">Giao hàng nhanh</p>
                        <p className="text-sm text-gray-500">
                          Nhận hàng trong 1-2 ngày - 30.000đ
                        </p>
                      </div>
                    </Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="notes" label="Ghi chú đơn hàng">
                  <TextArea
                    rows={3}
                    placeholder="Nhập ghi chú đơn hàng (nếu có)"
                  />
                </Form.Item>
              </Card>
            )}

            {currentStep === 1 && (
              <Card className="mb-6">
                <h2 className="text-lg font-bold mb-4">
                  Phương thức thanh toán
                </h2>

                <Form.Item
                  name="paymentMethod"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn phương thức thanh toán!",
                    },
                  ]}
                >
                  <Radio.Group className="w-full">
                    <Radio value="cod" className="w-full pb-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-50 rounded-md mr-3">
                          <ShopOutlined className="text-yellow-500 text-xl" />
                        </div>
                        <div>
                          <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                          <p className="text-sm text-gray-500">
                            Thanh toán bằng tiền mặt khi nhận được hàng
                          </p>
                        </div>
                      </div>
                    </Radio>
                    
                    <Radio value="bank_transfer" className="w-full mt-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded-md mr-3">
                          <CreditCardOutlined className="text-blue-500 text-xl" />
                        </div>
                        <div>
                          <p className="font-medium">Chuyển khoản ngân hàng</p>
                          <p className="text-sm text-gray-500">
                            Thực hiện thanh toán vào tài khoản ngân hàng của chúng tôi
                          </p>
                        </div>
                      </div>
                    </Radio>

                    <Radio value="momo" className="w-full mt-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-pink-50 rounded-md mr-3">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" 
                            alt="MoMo" 
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <p className="font-medium">Thanh toán qua ví MoMo</p>
                          <p className="text-sm text-gray-500">
                            Thanh toán qua ứng dụng MoMo
                          </p>
                        </div>
                      </div>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="mb-6">
                <h2 className="text-lg font-bold mb-4">Xác nhận đơn hàng</h2>
                
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Thông tin giao hàng</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p><strong>Người nhận:</strong> {form.getFieldValue("fullName")}</p>
                    <p><strong>Số điện thoại:</strong> {form.getFieldValue("phone")}</p>
                    <p><strong>Email:</strong> {form.getFieldValue("email")}</p>
                    <p><strong>Địa chỉ:</strong> {form.getFieldValue("address")}, {form.getFieldValue("ward")}, {form.getFieldValue("district")}, {form.getFieldValue("province")}</p>
                    <p><strong>Phương thức vận chuyển:</strong> {form.getFieldValue("shippingMethod") === "express" ? "Giao hàng nhanh" : "Giao hàng tiêu chuẩn"}</p>
                    {form.getFieldValue("notes") && (
                      <p><strong>Ghi chú:</strong> {form.getFieldValue("notes")}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Phương thức thanh toán</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {form.getFieldValue("paymentMethod") === "cod" && (
                      <p>Thanh toán khi nhận hàng (COD)</p>
                    )}
                    {form.getFieldValue("paymentMethod") === "bank_transfer" && (
                      <p>Chuyển khoản ngân hàng</p>
                    )}
                    {form.getFieldValue("paymentMethod") === "momo" && (
                      <p>Thanh toán qua ví MoMo</p>
                    )}
                  </div>
                </div>
              </Card>
            )}
            
            <div className="flex justify-between mt-6">
              {currentStep > 0 ? (
                <Button 
                  icon={<LeftOutlined />} 
                  onClick={handlePreviousStep}
                >
                  Quay lại
                </Button>
              ) : (
                <Link to="/gio-hang">
                  <Button 
                    icon={<LeftOutlined />}
                  >
                    Quay lại giỏ hàng
                  </Button>
                </Link>
              )}
              
              {currentStep < steps.length - 1 ? (
                <Button 
                  type="primary" 
                  onClick={handleNextStep}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Tiếp tục
                </Button>
              ) : (
                <Button 
                  type="primary" 
                  htmlType="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Hoàn tất đặt hàng
                </Button>
              )}
            </div>
          </Form>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <h2 className="text-lg font-bold mb-4">Đơn hàng của bạn</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-3 border-b border-gray-100">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-md" 
                    />
                    <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-800 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                    <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Divider className="my-3" />
            
            <div className="flex justify-between mb-2">
              <span>Tạm tính:</span>
              <span>{formatPrice(calculateSubtotal())}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span>Phí vận chuyển:</span>
              <span>{calculateShippingFee() > 0 ? formatPrice(calculateShippingFee()) : 'Miễn phí'}</span>
            </div>
            
            <Divider className="my-3" />
            
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Tổng cộng:</span>
              <span className="text-green-600">{formatPrice(calculateTotal())}</span>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Bằng cách tiến hành đặt hàng, bạn đồng ý với các{' '}
              <Link to="/dieu-khoan" className="text-green-600">
                điều khoản và điều kiện
              </Link>{' '}
              của chúng tôi.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Order;