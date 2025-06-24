import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  LeftOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Button, InputNumber, Spin, message } from "antd";
import type { CartItem } from "../../../types/interfaces/cartItem.interface";

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const saveCartToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  };

  useEffect(() => {
    // Lấy giỏ hàng từ localStorage
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    setCartItems(updatedItems);
    saveCartToLocalStorage(updatedItems);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    saveCartToLocalStorage(updatedItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const handleProceedToOrder = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.warning("Vui lòng đăng nhập để tiến hành đặt hàng.");

      localStorage.setItem("redirectAfterLogin", "/order");
      navigate("/login");
      return;
    }

    navigate("/order");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" tip="Đang tải giỏ hàng..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4">
        <ol className="list-none p-0 flex flex-wrap items-center">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-green-600">
              Trang chủ
            </Link>
            <span className="mx-2 text-gray-400">›</span>
          </li>
          <li className="flex items-center text-gray-800">Giỏ hàng</li>
        </ol>
      </nav>{" "}
      {cartItems.length > 0 ? (
        <div>
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Giỏ hàng của bạn
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items - Left side */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <ShoppingCartOutlined className="mr-3 text-green-600" />
                    Sản phẩm đã chọn ({cartItems.length} sản phẩm)
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.id}`}
                            className="text-lg font-medium text-gray-800 hover:text-green-600 transition-colors duration-200 line-clamp-2"
                          >
                            {item.name}
                          </Link>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-lg font-semibold text-green-600">
                              {formatPrice(item.price)}
                            </div>

                            <div className="flex items-center space-x-3">
                              {/* Quantity Control */}
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                  Số lượng:
                                </span>
                                <InputNumber
                                  min={1}
                                  value={item.quantity}
                                  onChange={(value) =>
                                    handleQuantityChange(
                                      item.id,
                                      value as number
                                    )
                                  }
                                  className="w-20"
                                  size="small"
                                />
                              </div>

                              {/* Remove Button */}
                              <Button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                                size="small"
                                icon={<DeleteOutlined />}
                              >
                                Xóa
                              </Button>
                            </div>
                          </div>

                          {/* Subtotal */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                Thành tiền:
                              </span>
                              <span className="text-lg font-bold text-gray-800">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping Button */}
              <div className="mt-6">
                <Link to="/products">
                  <Button
                    size="large"
                    className="flex items-center space-x-2 hover:bg-gray-50 border-gray-300"
                    icon={<LeftOutlined />}
                  >
                    <span>Tiếp tục mua sắm</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary - Right side */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-4">
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Thông tin thanh toán
                  </h3>
                </div>

                <div className="p-6">
                  {/* Order Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-medium text-gray-800">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span className="font-medium text-green-600">
                        Miễn phí
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Giảm giá:</span>
                      <span className="font-medium text-gray-800">0 đ</span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">
                          Tổng cộng:
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>{" "}
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 h-12 text-base font-semibold"
                      onClick={handleProceedToOrder}
                    >
                      Tiến hành đặt hàng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Giỏ hàng trống
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCartOutlined
                  style={{ fontSize: "60px" }}
                  className="text-gray-400"
                />
              </div>
            </div>{" "}
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Giỏ hàng trống!
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/">
                <Button
                  size="large"
                  className="bg-green-600 text-white hover:bg-green-700 border-green-600 hover:border-green-700 px-8 py-3 h-auto"
                >
                  <span className="text-base font-medium">Về trang chủ</span>
                </Button>
              </Link>

              <Link to="/products">
                <Button
                  size="large"
                  className="border-green-600 text-green-600 hover:border-green-700 hover:text-green-700 hover:bg-green-50 px-8 py-3 h-auto"
                >
                  <ShoppingOutlined className="mr-2" />
                  <span className="text-base font-medium">
                    Khám phá sản phẩm
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
