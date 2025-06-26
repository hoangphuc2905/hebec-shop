import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  LeftOutlined,
  ShoppingOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, InputNumber, Spin, message, Modal } from "antd";
import { cartStore } from "../../../stores/cartStore";
import type { CartItem } from "../../../types/interfaces/cartItem.interface";
import "../../../styles/override.css";

const Cart: React.FC = observer(() => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleQuantityChange = (id: string, quantity: number) => {
    cartStore.updateQuantity(id, quantity);
  };

  const handleShowDeleteModal = (item: CartItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      cartStore.removeFromCart(itemToDelete.id);
    }
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleProceedToOrder = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.warning("Vui lòng đăng nhập để tiến hành đặt hàng.");
      localStorage.setItem("redirectAfterLogin", "/order");
      navigate("/login");
      return;
    }

    // Lấy user từ localStorage
    const userStr = localStorage.getItem("user");
    let cityId = 0,
      districtId = 0,
      wardId = 0,
      address = "";
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        cityId = user.city?.id || 0;
        districtId = user.district?.id || 0;
        wardId = user.ward?.id || 0;
        address = user.address || "";
      } catch {}
    }

    navigate("/order", {
      state: { cityId, districtId, wardId, address },
    });
  };

  if (cartStore.loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
        <p className="text-gray-600 mt-4 ml-4">Đang tải giỏ hàng...</p>
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
      </nav>

      {!cartStore.isEmpty ? (
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
                    Sản phẩm đã chọn ({cartStore.totalItems} sản phẩm)
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartStore.cartItems.map((item) => (
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

                          {/* Thêm mô tả sản phẩm */}
                          {item.description && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex flex-col">
                              {item.importPrice &&
                                item.importPrice > item.price && (
                                  <span className="text-sm line-through text-gray-400 mb-1">
                                    {cartStore.formatPrice(item.importPrice)}
                                  </span>
                                )}
                              <span className="text-lg font-semibold text-green-600">
                                {cartStore.formatPrice(item.price)}
                              </span>
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
                                  className="px-4 text-green-600 font-medium rounded-md  transition-colors custom-input-number"
                                  size="small"
                                />
                              </div>

                              {/* Remove Button */}
                              <Button
                                onClick={() => handleShowDeleteModal(item)}
                                className="override-delete-btn"
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
                                {cartStore.formatPrice(
                                  item.price * item.quantity
                                )}
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
                  <button className="py-2 px-4 border border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors">
                    <LeftOutlined className="mr-2" />
                    <span>Tiếp tục mua sắm</span>
                  </button>
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
                        {cartStore.formatPrice(cartStore.totalPrice)}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">
                          Tổng cộng:
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {cartStore.formatPrice(cartStore.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      type="primary"
                      size="large"
                      block
                      className="override-ant-btn"
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
            </div>

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

      {/* Modal xác nhận xóa sản phẩm */}
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-orange-500 mr-2" />
            Xác nhận xóa sản phẩm
          </div>
        }
        open={showDeleteModal}
        onOk={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{
          className: "override-delete-confirm-btn",
          danger: true,
        }}
        cancelButtonProps={{
          className: "override-cancel-btn",
        }}
        width={500}
      >
        <div className="py-4">
          {itemToDelete && (
            <div>
              <p className="mb-4 text-gray-600">
                Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
              </p>

              <div className="bg-gray-50 p-4 rounded-md flex items-center space-x-4">
                <img
                  src={itemToDelete.image}
                  alt={itemToDelete.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 line-clamp-2">
                    {itemToDelete.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Số lượng: {itemToDelete.quantity} | Giá:{" "}
                    {cartStore.formatPrice(itemToDelete.price)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
});

export default Cart;
