import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Modal,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  ShopOutlined,
  CheckOutlined,
  LeftOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { createOrder } from "../../../api/orderApi";
import { EPaymentType } from "../../../types/enums/ePaymentType.enum";
import type { CartItem } from "../../../types/interfaces/cartItem.interface";
import type {
  CreateOrderRequest,
  OrderFormValues,
} from "../../../types/interfaces/order.interface";

const { Option } = Select;
const { TextArea } = Input;

const initialValues: OrderFormValues = {
  fullName: "",
  phone: "",
  email: "",
  province: "",
  district: "",
  ward: "",
  address: "",
  paymentMethod: EPaymentType.COD,
  notes: "",
};

const Order: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [orderFormData, setOrderFormData] = useState<OrderFormValues | null>(
    null
  );

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
    const loadCartData = () => {
      try {
        const state = location.state as {
          directPurchase?: boolean;
          productId?: string;
          quantity?: number;
        } | null;

        if (state?.directPurchase) {
          const cartJson = localStorage.getItem("cart");
          const allCartItems: CartItem[] = cartJson ? JSON.parse(cartJson) : [];

          const directPurchaseItem = allCartItems.find(
            (item) => String(item.id) === String(state.productId)
          );

          if (directPurchaseItem) {
            setCartItems([
              {
                ...directPurchaseItem,
                quantity: state.quantity || 1,
              },
            ]);
          }
        } else {
          const cartJson = localStorage.getItem("cart");
          const allCartItems: CartItem[] = cartJson ? JSON.parse(cartJson) : [];
          setCartItems(allCartItems);
        }

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu giỏ hàng:", error);
        setCartItems([]);
        setLoading(false);
      }
    };

    loadCartData();
  }, [location.state]);

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateShippingFee = () => {
    return 0; // Miễn phí vận chuyển
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShippingFee();
  };

  const calculateTotalWeight = () => {
    return cartItems.reduce(
      (total, item) => total + (item.weight || 500) * item.quantity,
      0
    );
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const handleNextStep = () => {
    form
      .validateFields()
      .then((values) => {
        // Lưu dữ liệu form hiện tại
        setOrderFormData((prev) => ({
          ...prev,
          ...values,
        }));
        setCurrentStep(currentStep + 1);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFormSubmit = async (values: OrderFormValues) => {
    // Merge với dữ liệu đã lưu từ step trước
    const completeFormData = {
      ...orderFormData,
      ...values,
    };
    setOrderFormData(completeFormData);
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!orderFormData) return;

    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      const subtotal = calculateSubtotal();
      const shippingFee = 0;
      const totalMoney = calculateTotal();
      const totalWeight = calculateTotalWeight();

      const orderData: CreateOrderRequest = {
        order: {
          note: orderFormData.notes || "",
          paymentMethod: orderFormData.paymentMethod,
          deliveryType: "standard",
          receiverName: orderFormData.fullName,
          receiverPhone: orderFormData.phone,
          receiverAddress: `${orderFormData.address}, ${orderFormData.ward}, ${orderFormData.district}, ${orderFormData.province}`,
          isQuickDelivery: false,
          isFreeShip: true,
          isReceiveAtStore: false,
          shipFee: 0,
          totalMoney: totalMoney,
          moneyFinal: totalMoney,
          subTotalMoney: subtotal,
          totalWeight: totalWeight,
        },
        details: cartItems.map((item) => ({
          quantity: item.quantity,
          productId: parseInt(item.id),
          name: item.name,
          price: item.price,
          finalPrice: item.price,
          weight: item.weight || 500,
          isGift: false,
        })),
        cityId: 1,
        districtId: 1,
        wardId: 1,
      };

      message.loading({ content: "Đang xử lý đơn hàng...", key: "order" });

      const result = await createOrder(orderData);

      message.success({
        content: "Đặt hàng thành công!",
        key: "order",
        duration: 2,
      });

      if (!location.state?.directPurchase) {
        localStorage.removeItem("cart");
      }

      setTimeout(() => {
        navigate("/order-success", {
          state: {
            orderId: result?.id,
            orderCode: result?.code,
            orderData: orderFormData,
            orderTotal: totalMoney,
          },
        });
      }, 1000);
    } catch (error: any) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      message.error({
        content: error.message || "Đặt hàng thất bại. Vui lòng thử lại!",
        key: "order",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelOrder = () => {
    setShowConfirmModal(false);
    setOrderFormData(null);
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case EPaymentType.COD:
        return "Thanh toán khi nhận hàng (COD)";
      case EPaymentType.Online:
        return "Thanh toán trực tuyến";
      case EPaymentType.Balance:
        return "Thanh toán bằng điểm";
      default:
        return "";
    }
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
            onFinish={handleFormSubmit}
          >
            {currentStep === 0 && (
              <Card className="mb-6">
                <h2 className="text-lg font-bold mb-4">Thông tin giao hàng</h2>

                <Form.Item
                  name="fullName"
                  label="Họ tên"
                  rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
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
                  <TextArea rows={3} placeholder="Số nhà, tên đường..." />
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
                    <Radio
                      value={EPaymentType.COD}
                      className="w-full pb-4 border-b border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-yellow-50 rounded-md mr-3">
                          <ShopOutlined className="text-yellow-500 text-xl" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Thanh toán khi nhận hàng (COD)
                          </p>
                          <p className="text-sm text-gray-500">
                            Thanh toán bằng tiền mặt khi nhận được hàng
                          </p>
                        </div>
                      </div>
                    </Radio>

                    <Radio
                      value={EPaymentType.Online}
                      className="w-full mt-4 pb-4 border-b border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded-md mr-3">
                          <CreditCardOutlined className="text-blue-500 text-xl" />
                        </div>
                        <div>
                          <p className="font-medium">Thanh toán trực tuyến</p>
                          <p className="text-sm text-gray-500">
                            Thanh toán qua thẻ ngân hàng, ví điện tử
                          </p>
                        </div>
                      </div>
                    </Radio>

                    <Radio value={EPaymentType.Balance} className="w-full mt-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-50 rounded-md mr-3">
                          <CheckOutlined className="text-green-500 text-xl" />
                        </div>
                        <div>
                          <p className="font-medium">Thanh toán bằng điểm</p>
                          <p className="text-sm text-gray-500">
                            Sử dụng điểm tích lũy để thanh toán
                          </p>
                        </div>
                      </div>
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Card>
            )}

            <div className="flex justify-between mt-6">
              {currentStep > 0 ? (
                <Button
                  icon={<LeftOutlined />}
                  onClick={handlePreviousStep}
                  disabled={submitting}
                >
                  Quay lại
                </Button>
              ) : (
                <Link to="/gio-hang">
                  <Button icon={<LeftOutlined />} disabled={submitting}>
                    Quay lại giỏ hàng
                  </Button>
                </Link>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  onClick={handleNextStep}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={submitting}
                >
                  Tiếp tục
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => {
                    form
                      .validateFields()
                      .then((values) => {
                        handleFormSubmit(values);
                      })
                      .catch((info) => {
                        console.log("Validate Failed:", info);
                      });
                  }}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={submitting}
                >
                  Xác nhận đặt hàng
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
                <div
                  key={item.id}
                  className="flex items-center py-3 border-b border-gray-100"
                >
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
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
              <span>Miễn phí</span>
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Tổng cộng:</span>
              <span className="text-green-600">
                {formatPrice(calculateTotal())}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal xác nhận đặt hàng */}
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-orange-500 mr-2" />
            Xác nhận đặt hàng
          </div>
        }
        open={showConfirmModal}
        onOk={handleConfirmOrder}
        onCancel={handleCancelOrder}
        okText="Đặt hàng"
        cancelText="Hủy"
        confirmLoading={submitting}
        okButtonProps={{
          className: "bg-green-600 hover:bg-green-700",
        }}
        width={600}
      >
        <div className="py-4">
          <p className="mb-4 text-gray-600">
            Bạn có chắc chắn muốn đặt hàng với thông tin sau không?
          </p>

          {orderFormData && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Thông tin giao hàng:</h4>
                <p>
                  <strong>Người nhận:</strong> {orderFormData.fullName}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {orderFormData.phone}
                </p>
                <p>
                  <strong>Email:</strong> {orderFormData.email}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {orderFormData.address},{" "}
                  {orderFormData.ward}, {orderFormData.district},{" "}
                  {orderFormData.province}
                </p>
                {orderFormData.notes && (
                  <p>
                    <strong>Ghi chú:</strong> {orderFormData.notes}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Phương thức thanh toán:</h4>
                <p>{getPaymentMethodText(orderFormData.paymentMethod)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Tổng tiền:</h4>
                <p className="text-lg font-bold text-green-600">
                  {formatPrice(calculateTotal())}
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Order;
