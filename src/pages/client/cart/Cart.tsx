import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  LeftOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Empty, Button, InputNumber, Spin } from "antd";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Mô phỏng call API lấy giỏ hàng từ server/local storage
    setTimeout(() => {
      // Thêm sản phẩm mẫu vào giỏ hàng
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

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Format giá tiền theo VND
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  // Xử lý khi nhấn nút tiến hành đặt hàng
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
                            to={`/san-pham/${item.id}`}
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
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <DeleteOutlined />
                      </button>
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
