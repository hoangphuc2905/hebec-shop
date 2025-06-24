import { makeAutoObservable, runInAction } from "mobx";
import { createOrder } from "../api/orderApi";
import { EPaymentType } from "../types/enums/ePaymentType.enum";
import type { CartItem } from "../types/interfaces/cartItem.interface";
import type {
  CreateOrderRequest,
  OrderFormValues,
} from "../types/interfaces/order.interface";
import { message } from "antd";

export class OrderStore {
  // State
  loading = true;
  submitting = false;
  cartItems: CartItem[] = [];
  currentStep = 0;
  showConfirmModal = false;
  orderFormData: OrderFormValues | null = null;

  // Address data
  provinces = [
    "Hà Nội",
    "Hồ Chí Minh",
    "Hải Phòng",
    "Đà Nẵng",
    "Hải Dương",
    "Bắc Ninh",
  ];
  districts = ["Quận 1", "Quận 2", "Quận 3", "Huyện A", "Huyện B"];
  wards = ["Phường 1", "Phường 2", "Xã A", "Xã B"];

  constructor() {
    makeAutoObservable(this);
  }

  // Actions
  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  setSubmitting = (submitting: boolean) => {
    this.submitting = submitting;
  };

  setCartItems = (items: CartItem[]) => {
    this.cartItems = items;
  };

  setCurrentStep = (step: number) => {
    this.currentStep = step;
  };

  setShowConfirmModal = (show: boolean) => {
    this.showConfirmModal = show;
  };

  setOrderFormData = (data: OrderFormValues | null) => {
    this.orderFormData = data;
  };

  updateOrderFormData = (data: Partial<OrderFormValues>) => {
    if (this.orderFormData) {
      this.orderFormData = { ...this.orderFormData, ...data };
    } else {
      this.orderFormData = data as OrderFormValues;
    }
  };

  nextStep = () => {
    this.currentStep = this.currentStep + 1;
  };

  previousStep = () => {
    this.currentStep = this.currentStep - 1;
  };

  openConfirmModal = (formData: OrderFormValues) => {
    const completeFormData = {
      ...this.orderFormData,
      ...formData,
    };
    this.orderFormData = completeFormData;
    this.showConfirmModal = true;
  };

  closeConfirmModal = () => {
    this.showConfirmModal = false;
    this.orderFormData = null;
  };

  // Load cart data
  loadCartData = (locationState: any) => {
    try {
      console.log("Location state:", locationState);
      console.log("Current localStorage cart:", localStorage.getItem("cart"));
      console.log(
        "Current localStorage CartStore:",
        localStorage.getItem("CartStore")
      ); // Thêm log này

      if (locationState?.directPurchase) {
        // Thử cả 2 key
        let cartJson = localStorage.getItem("cart");
        if (!cartJson) {
          const cartStore = localStorage.getItem("CartStore");
          if (cartStore) {
            const cartStoreData = JSON.parse(cartStore);
            cartJson = JSON.stringify(cartStoreData.cartItems || []);
          }
        }

        const allCartItems: CartItem[] = cartJson ? JSON.parse(cartJson) : [];

        console.log("All cart items:", allCartItems);
        console.log("Looking for product ID:", locationState.productId);

        const directPurchaseItem = allCartItems.find(
          (item) => String(item.id) === String(locationState.productId)
        );

        console.log("Found direct purchase item:", directPurchaseItem);

        if (directPurchaseItem) {
          runInAction(() => {
            this.cartItems = [
              {
                ...directPurchaseItem,
                quantity: locationState.quantity || 1,
              },
            ];
          });
        } else {
          console.warn("Direct purchase item not found in cart");
        }
      } else {
        // Thử cả 2 key cho regular cart
        let cartJson = localStorage.getItem("cart");
        let allCartItems: CartItem[] = [];

        if (!cartJson) {
          // Nếu không có key 'cart', thử key 'CartStore'
          const cartStore = localStorage.getItem("CartStore");
          if (cartStore) {
            try {
              const cartStoreData = JSON.parse(cartStore);
              allCartItems = cartStoreData.cartItems || [];
            } catch (parseError) {
              console.error("Error parsing CartStore data:", parseError);
              allCartItems = [];
            }
          }
        } else {
          try {
            allCartItems = JSON.parse(cartJson);
          } catch (parseError) {
            console.error("Error parsing cart data:", parseError);
            allCartItems = [];
          }
        }

        console.log("Loading regular cart items:", allCartItems);

        runInAction(() => {
          this.cartItems = allCartItems;
        });
      }

      console.log("Final cart items:", this.cartItems);
      this.setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu giỏ hàng:", error);
      runInAction(() => {
        this.cartItems = [];
      });
      this.setLoading(false);
    }
  };

  // Calculations
  get subtotal() {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  get shippingFee() {
    return 0; // Miễn phí vận chuyển
  }

  get total() {
    return this.subtotal + this.shippingFee;
  }

  get totalWeight() {
    return this.cartItems.reduce(
      (total, item) => total + (item.weight || 500) * item.quantity,
      0
    );
  }

  // Format price
  formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  // Get payment method text
  getPaymentMethodText = (method: string) => {
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

  // Create order
  createOrder = async (navigate: any, orderData: any) => {
    if (!this.orderFormData) return;

    this.setSubmitting(true);
    this.setShowConfirmModal(false);

    try {
      // Nếu orderData có details từ Order.tsx, dùng luôn
      let finalDetails;

      if (orderData?.details && Array.isArray(orderData.details)) {
        // Sử dụng dữ liệu từ Order.tsx
        finalDetails = orderData.details.map((item: any) => ({
          quantity: item.quantity,
          productId: parseInt(item.productId),
          name: item.name || `Product ${item.productId}`,
          price: item.price,
          finalPrice: item.price,
          weight: 500,
          isGift: false,
        }));
      } else {
        // Fallback: sử dụng cartItems
        finalDetails = this.cartItems.map((item) => ({
          quantity: item.quantity,
          productId: parseInt(item.id),
          name: item.name,
          price: item.price,
          finalPrice: item.price,
          weight: item.weight || 500,
          isGift: false,
        }));
      }

      const totalAmount = orderData?.totalAmount || this.total;

      const apiOrderData: CreateOrderRequest = {
        order: {
          note: this.orderFormData.notes || "",
          paymentMethod: this.orderFormData.paymentMethod,
          deliveryType: "standard",
          receiverName: this.orderFormData.fullName,
          receiverPhone: this.orderFormData.phone,
          receiverAddress: `${this.orderFormData.address}, ${this.orderFormData.ward}, ${this.orderFormData.district}, ${this.orderFormData.province}`,
          isQuickDelivery: false,
          isFreeShip: true,
          isReceiveAtStore: false,
          shipFee: 0,
          totalMoney: totalAmount,
          moneyFinal: totalAmount,
          subTotalMoney: totalAmount,
          totalWeight: finalDetails.reduce(
            (total, item) => total + item.weight * item.quantity,
            0
          ),
        },
        details: finalDetails,
        cityId: 1,
        districtId: 1,
        wardId: 1,
      };

      console.log("=== FINAL API ORDER DATA ===");
      console.log(JSON.stringify(apiOrderData, null, 2));

      message.loading({ content: "Đang xử lý đơn hàng...", key: "order" });

      const result = await createOrder(apiOrderData);

      // Kiểm tra và xóa giỏ hàng NGAY SAU KHI API THÀNH CÔNG
      const isDirectPurchase = orderData?.directPurchase === true;
      console.log("🔍 Direct purchase check:", isDirectPurchase);

      if (!isDirectPurchase) {
        // Xóa localStorage
        localStorage.removeItem("cart");
        localStorage.removeItem("CartStore");
        console.log("✅ Đã xóa localStorage giỏ hàng");

        // Reset cartItems trong store này luôn
        runInAction(() => {
          this.cartItems = [];
        });
        console.log("✅ Đã reset cartItems trong orderStore");

        // Dispatch events để notify các component khác
        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(
          new CustomEvent("storage", {
            detail: { key: "cart", newValue: null },
          })
        );
        console.log("✅ Đã dispatch events để cập nhật UI");
      } else {
        console.log("ℹ️ Mua ngay - không xóa giỏ hàng");
      }

      message.success({
        content: "Đặt hàng thành công! Đang chuyển về trang chủ...",
        key: "order",
        duration: 3,
      });

      // Chuyển về trang chủ và reload sau 2 giây
      setTimeout(() => {
        navigate("/", { replace: true });
        // Reload trang để đảm bảo mọi thứ được reset
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }, 1000);
    } catch (error: any) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      message.error({
        content: error.message || "Đặt hàng thất bại. Vui lòng thử lại!",
        key: "order",
      });
    } finally {
      this.setSubmitting(false);
    }
  };

  // Reset store
  reset = () => {
    this.loading = true;
    this.submitting = false;
    this.cartItems = [];
    this.currentStep = 0;
    this.showConfirmModal = false;
    this.orderFormData = null;
  };
}

export const orderStore = new OrderStore();
