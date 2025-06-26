import { makeAutoObservable, action, computed } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { message } from "antd";
import type { CartItem } from "../types/interfaces/cartItem.interface";

class CartStore {
  cartItems: CartItem[] = [];
  loading: boolean = false;

  constructor() {
    makeAutoObservable(this, {
      // Explicitly mark actions
      addToCart: action,
      removeFromCart: action,
      updateQuantity: action,
      clearCart: action,
      setLoading: action,
      // Computed properties
      totalItems: computed,
      totalPrice: computed,
      isEmpty: computed,
    });

    // Make store persistent
    makePersistable(this, {
      name: "CartStore",
      properties: ["cartItems"],
      storage: window.localStorage,
    });
  }

  @action
  addToCart = (product: Omit<CartItem, "quantity">, quantity: number = 1) => {
    const existingItem = this.cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      message.success("Đã cập nhật số lượng sản phẩm trong giỏ hàng");
    } else {
      this.cartItems.push({ ...product, quantity });
      message.success("Đã thêm sản phẩm vào giỏ hàng");
    }

    // Dispatch event for header cart count update
    window.dispatchEvent(new Event("cart-updated"));
  };

  @action
  removeFromCart = (productId: string) => {
    const index = this.cartItems.findIndex((item) => item.id === productId);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  @action
  updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    const item = this.cartItems.find((item) => item.id === productId);
    if (item) {
      item.quantity = quantity;
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  @action
  clearCart = () => {
    this.cartItems = [];
    window.dispatchEvent(new Event("cart-updated"));
  };

  @action
  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  @computed
  get totalItems(): number {
    // Trả về số lượng loại sản phẩm khác nhau (length của array)
    return this.cartItems.length;
  }

  @computed
  get totalQuantity(): number {
    // Trả về tổng số lượng sản phẩm (cho các trang khác cần dùng)
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  @computed
  get totalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  @computed
  get isEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  formatPrice = (price: number): string => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  getItemById = (id: string): CartItem | undefined => {
    return this.cartItems.find((item) => item.id === id);
  };
}
const cartStore = new CartStore();
export { cartStore };
export default CartStore;
