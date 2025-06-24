export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image: string;
  importPrice?: number; // Thêm dòng này
}
