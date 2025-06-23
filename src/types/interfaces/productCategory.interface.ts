import type { Product } from "./product.interface";

export interface ProductCategory {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  code: string;
  name: string;
  nameEn: string; //tên tiếng anh
  icon: string;
  level: number;
  slug: string;
  refPoint: number; //thưởng điểm hoa hồng khi chia sẻ mua hàng, tính theo %
  isVisible: boolean;
  metaKeyword: string;
  visibleOnMenu: boolean; //hiển thị trên menu
  isHighlight: boolean; //true: cate nổi bật, hiển thị dạng list + product ở mobile
//   type: ProductCategoryType;
  position: number;
  description: string;
  isVisibleInApp: boolean;
  children: ProductCategory[];
  parent: ProductCategory;
  products: Product[];
//   refCustomers: RefCustomer[];
//   store: Store;
}
