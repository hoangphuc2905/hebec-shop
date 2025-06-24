import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Radio,
  Divider,
  Steps,
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
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { orderStore } from "../../../stores/orderStore";
import { EPaymentType } from "../../../types/enums/ePaymentType.enum";
import type { OrderFormValues } from "../../../types/interfaces/order.interface";
import "../../../styles/override.css";

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

const Order: React.FC = observer(() => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { directPurchase, product, quantity } = location.state || {};

  console.log("Order received state:", location.state);

  useEffect(() => {
    console.log("Direct purchase:", directPurchase);
    console.log("Product:", product);
    console.log("Quantity:", quantity);

    if (directPurchase && product) {
      // Giả lập dữ liệu từ cart store
      const cartData = {
        directPurchase: true,
        selectedItems: [
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity || 1,
          },
        ],
      };
      console.log("Processed cart data for direct purchase:", cartData);
      orderStore.loadCartData(cartData);
    } else {
      orderStore.loadCartData(location.state);
    }

    return () => {
      orderStore.reset();
    };
  }, [location.state, directPurchase, product, quantity]);

  const handleNextStep = () => {
    form
      .validateFields()
      .then((values) => {
        orderStore.updateOrderFormData(values);
        orderStore.nextStep();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handlePreviousStep = () => {
    orderStore.previousStep();
  };

  const handleFormSubmit = async (values: OrderFormValues) => {
    orderStore.openConfirmModal(values);
  };

  // Thêm helper function này vào đầu component (sau các import)
  const getOrderData = (directPurchase, product, quantity, orderStore) => {
    let orderDetails = [];
    let totalAmount = 0;

    if (directPurchase && product) {
      // Mua ngay
      orderDetails = [
        {
          productId: product.id,
          quantity: quantity || 1,
          price: product.price,
          name: product.name, // Thêm tên sản phẩm để debug
          image: product.image, // Thêm hình ảnh để debug
        },
      ];
      totalAmount = product.price * (quantity || 1);
    } else if (orderStore.cartItems.length > 0) {
      // Từ giỏ hàng
      orderDetails = orderStore.cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
      }));
      totalAmount = orderStore.total;
    }

    return {
      orderDetails,
      totalAmount,
      hasProducts: orderDetails.length > 0,
    };
  };

  const handleConfirmOrder = async () => {
    try {
      const { orderDetails, totalAmount, hasProducts } = getOrderData(
        directPurchase,
        product,
        quantity,
        orderStore
      );

      console.log("=== DEBUG ORDER DATA ===");
      console.log("directPurchase:", directPurchase);
      console.log("product:", product);
      console.log("quantity:", quantity);
      console.log("orderStore.cartItems:", orderStore.cartItems);
      console.log("orderStore.total:", orderStore.total);
      console.log("orderDetails:", orderDetails);
      console.log("totalAmount:", totalAmount);
      console.log("hasProducts:", hasProducts);
      console.log("orderStore.orderFormData:", orderStore.orderFormData);

      if (!hasProducts) {
        console.error("Không có sản phẩm để đặt hàng");
        return;
      }

      // Validate required fields
      if (
        !orderStore.orderFormData.fullName ||
        !orderStore.orderFormData.phone
      ) {
        console.error("Thiếu thông tin bắt buộc:", orderStore.orderFormData);
        return;
      }

      // Tạo Details array và validate
      const detailsArray = orderDetails.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      console.log("=== DETAILS ARRAY VALIDATION ===");
      console.log("detailsArray:", detailsArray);
      console.log("detailsArray.length:", detailsArray.length);
      console.log("Array.isArray(detailsArray):", Array.isArray(detailsArray));

      // Validate từng item trong Details
      detailsArray.forEach((item, index) => {
        console.log(`Detail ${index}:`, item);
        console.log(
          `  - productId: ${item.productId} (type: ${typeof item.productId})`
        );
        console.log(
          `  - quantity: ${item.quantity} (type: ${typeof item.quantity})`
        );
        console.log(`  - price: ${item.price} (type: ${typeof item.price})`);
      });

      const orderData = {
        ...orderStore.orderFormData,
        details: detailsArray,
        totalAmount: totalAmount,
        shippingFee: 0,
        discount: 0,
        directPurchase: directPurchase || false, // Đảm bảo có giá trị boolean
      };

      console.log("=== FINAL ORDER DATA FOR API ===");
      console.log(JSON.stringify(orderData, null, 2));

      // Validate final data trước khi gửi
      if (
        !orderData.details ||
        !Array.isArray(orderData.details) ||
        orderData.details.length === 0
      ) {
        console.error("❌ Details array is invalid:", orderData.details);
        return;
      }

      console.log("✅ Order data validation passed, sending to API...");
      console.log("🔍 Is direct purchase?:", orderData.directPurchase);

      await orderStore.createOrder(navigate, orderData);
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleCancelOrder = () => {
    orderStore.closeConfirmModal();
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

  if (orderStore.loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large">
          <div className="p-12">
            <p className="text-gray-600 mt-4">Đang tải thông tin đơn hàng...</p>
          </div>
        </Spin>
      </div>
    );
  }

  // Kiểm tra nếu là mua ngay
  if (directPurchase && product) {
    // Xử lý với sản phẩm từ mua ngay
    console.log("Direct purchase product:", product, "quantity:", quantity);
  }

  // Thêm debug để xem cartItems
  console.log("Order store cartItems:", orderStore.cartItems);
  console.log("Order store total:", orderStore.total);

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
        current={orderStore.currentStep}
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
            {orderStore.currentStep === 0 && (
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
                      {orderStore.provinces.map((province) => (
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
                      {orderStore.districts.map((district) => (
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
                      {orderStore.wards.map((ward) => (
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

            {orderStore.currentStep === 1 && (
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
              {orderStore.currentStep > 0 ? (
                <button
                  onClick={handlePreviousStep}
                  disabled={orderStore.submitting}
                  className="py-2 px-4 border border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors"
                >
                  <LeftOutlined className="mr-2" />
                  Quay lại
                </button>
              ) : (
                <Link to="/cart">
                  <button
                    disabled={orderStore.submitting}
                    className="py-2 px-4 border border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors"
                  >
                    <LeftOutlined className="mr-2" />
                    Quay lại giỏ hàng
                  </button>
                </Link>
              )}

              {orderStore.currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  className="override-ant-btn"
                  onClick={handleNextStep}
                  disabled={orderStore.submitting}
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
                  className="override-ant-btn"
                  disabled={orderStore.submitting}
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
              {/* Kiểm tra nếu orderStore.cartItems rỗng và là direct purchase */}
              {orderStore.cartItems.length > 0 ? (
                orderStore.cartItems.map((item) => (
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
                        {orderStore.formatPrice(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {orderStore.formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))
              ) : directPurchase && product ? (
                // Fallback: Hiển thị sản phẩm trực tiếp từ location.state
                <div className="flex items-center py-3 border-b border-gray-100">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium line-clamp-2">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {orderStore.formatPrice(product.price)} x {quantity || 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {orderStore.formatPrice(product.price * (quantity || 1))}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  Không có sản phẩm nào
                </div>
              )}
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between mb-2">
              <span>Tạm tính:</span>
              <span>
                {directPurchase && product && orderStore.cartItems.length === 0
                  ? orderStore.formatPrice(product.price * (quantity || 1))
                  : orderStore.formatPrice(orderStore.subtotal)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Tổng cộng:</span>
              <span className="text-green-600">
                {directPurchase && product && orderStore.cartItems.length === 0
                  ? orderStore.formatPrice(product.price * (quantity || 1))
                  : orderStore.formatPrice(orderStore.total)}
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
        open={orderStore.showConfirmModal}
        onOk={handleConfirmOrder}
        onCancel={handleCancelOrder}
        okText="Đặt hàng"
        cancelText="Hủy"
        confirmLoading={orderStore.submitting}
        okButtonProps={{
          className: "override-ant-btn",
        }}
        cancelButtonProps={{
          className: "override-cancel-btn",
        }}
        width={700}
      >
        <div className="py-4">
          <p className="mb-6 text-gray-600">
            Bạn có chắc chắn muốn đặt hàng với thông tin sau không?
          </p>

          {orderStore.orderFormData && (
            <div className="space-y-4">
              {/* Thông tin giao hàng */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-3 text-gray-800 flex items-center">
                  <UserOutlined className="mr-2 text-green-600" />
                  Thông tin giao hàng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <p>
                    <strong className="text-gray-700">Người nhận:</strong>{" "}
                    <span className="ml-2">
                      {orderStore.orderFormData.fullName}
                    </span>
                  </p>
                  <p>
                    <strong className="text-gray-700">Số điện thoại:</strong>{" "}
                    <span className="ml-2">
                      {orderStore.orderFormData.phone}
                    </span>
                  </p>
                  <p className="md:col-span-2">
                    <strong className="text-gray-700">Email:</strong>{" "}
                    <span className="ml-2">
                      {orderStore.orderFormData.email}
                    </span>
                  </p>
                  <p className="md:col-span-2">
                    <strong className="text-gray-700">Địa chỉ:</strong>{" "}
                    <span className="ml-2">
                      {orderStore.orderFormData.address},{" "}
                      {orderStore.orderFormData.ward},{" "}
                      {orderStore.orderFormData.district},{" "}
                      {orderStore.orderFormData.province}
                    </span>
                  </p>
                  {orderStore.orderFormData.notes && (
                    <p className="md:col-span-2">
                      <strong className="text-gray-700">Ghi chú:</strong>{" "}
                      <span className="ml-2">
                        {orderStore.orderFormData.notes}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-3 text-gray-800 flex items-center">
                  <ShoppingCartOutlined className="mr-2 text-green-600" />
                  Sản phẩm đặt hàng (
                  {orderStore.cartItems.length > 0
                    ? orderStore.cartItems.length
                    : directPurchase && product
                    ? 1
                    : 0}{" "}
                  sản phẩm)
                </h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {orderStore.cartItems.length > 0 ? (
                    orderStore.cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3 p-2 bg-white rounded border"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {orderStore.formatPrice(item.price)} ×{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm text-green-600">
                            {orderStore.formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : directPurchase && product ? (
                    <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {orderStore.formatPrice(product.price)} ×{" "}
                          {quantity || 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm text-green-600">
                          {orderStore.formatPrice(
                            product.price * (quantity || 1)
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      Không có sản phẩm nào
                    </div>
                  )}
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-3 text-gray-800 flex items-center">
                  <CreditCardOutlined className="mr-2 text-green-600" />
                  Phương thức thanh toán
                </h4>
                <p className="text-sm">
                  {orderStore.getPaymentMethodText(
                    orderStore.orderFormData.paymentMethod
                  )}
                </p>
              </div>

              {/* Tổng tiền */}
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <h4 className="font-medium mb-3 text-gray-800">
                  Chi tiết thanh toán
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">
                      {directPurchase &&
                      product &&
                      orderStore.cartItems.length === 0
                        ? orderStore.formatPrice(
                            product.price * (quantity || 1)
                          )
                        : orderStore.formatPrice(orderStore.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-medium">0 đ</span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">
                      Tổng cộng:
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {directPurchase &&
                      product &&
                      orderStore.cartItems.length === 0
                        ? orderStore.formatPrice(
                            product.price * (quantity || 1)
                          )
                        : orderStore.formatPrice(orderStore.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
});

export default Order;
