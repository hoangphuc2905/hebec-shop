import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  LeftOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Button, InputNumber, Spin } from "antd";
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
          <li className="flex items-center text-gray-800">Giỏ hàng</li>
        </ol>
      </nav>

      {cartItems.length > 0 ? (
        <div>
          <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>

          {/* Cart items */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-4 text-left">Sản phẩm</th>
                  <th className="py-4 px-4 text-center">Đơn giá</th>
                  <th className="py-4 px-4 text-center">Số lượng</th>
                  <th className="py-4 px-4 text-center">Thành tiền</th>
                  <th className="py-4 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover mr-4"
                        />
                        <div>
                          <Link
                            to={`/products/${item.id}`}
                            className="font-medium text-gray-800 hover:text-green-600"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {formatPrice(item.price)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center">
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) =>
                            handleQuantityChange(item.id, value as number)
                          }
                          className="w-16"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <DeleteOutlined />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order summary */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-4">Tổng tiền giỏ hàng</h3>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Tạm tính:</span>
                <span className="font-medium">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Phí vận chuyển:</span>
                <span className="font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between py-4 text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
              <Button
                type="primary"
                size="large"
                block
                className="bg-green-600 hover:bg-green-700 mt-4"
                onClick={handleProceedToOrder}
              >
                Tiến hành đặt hàng
              </Button>
              <Link to="/san-pham">
                <Button
                  size="large"
                  block
                  className="mt-4 flex items-center justify-center"
                  icon={<LeftOutlined />}
                >
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // Giỏ hàng trống
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <ShoppingCartOutlined
              style={{ fontSize: "60px" }}
              className="text-gray-400"
            />
          </div>
          <h2 className="text-2xl font-bold mb-6">Giỏ hàng trống!</h2>
          <div className="flex justify-center space-x-4">
            <Link to="/">
              <Button
                size="large"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Về trang chủ
              </Button>
            </Link>
            <Link to="/san-pham">
              <Button
                size="large"
                className="border-green-600 text-green-600 hover:border-green-700 hover:text-green-700"
              >
                <ShoppingOutlined className="mr-1" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
