import type { Store } from "antd/es/form/interface";
import type { ProductCategory } from "./productCategory.interface";

export interface Product {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  code: string;
  no: number;
  kvId: string;
  kvName: string;
  kvCode: string;
  needNegotiate: boolean;
  isVariantProduct: boolean; //true: là sp biến thể
  syncId: string;
  //   type: ProductType;
  //   deliveryType: DeliveryType;
  brandName: string; //thương hiệu
  name: string;
  nameEn: string; //tên tiếng anh
  unitPrice: number; //giá lẻ
  finalPrice: number; //giá đã gồm khuyến mãi
  importPrice: number; //giá nhập kho (vốn)
  minPrice: number; //giá thấp nhất (SP có biến thể)
  maxPrice: number; //giá cao nhất (SP có biến thể)
  stock: number;
  minimumStock: number;
  isOutStock: boolean;
  //quy cách
  length: number; //cm
  width: number; //cm
  height: number; //cm
  weight: number; //gram
  taxPercent: number; //thuế(%)
  image: string;
  imageBackup: string;
  sold: number; //sl đã bán
  pending: number; //sl đã bán nhưng chưa hoàn tất đơn
  description: string;
  descriptionEn: string;
  totalStar: number;
  refPoint: number; //thưởng điểm hoa hồng khi chia sẻ mua hàng, tính theo %
  totalRate: number;
  totalLike: number;
  totalView: number;
  isHighlight: boolean;
  isActive: boolean; //true: hiển thị ở web khách hàng
  videoUrl: string;
  //   mode: ProductMode;
  lifeCycleDay: number; //vòng đời mua sản phẩm
  isVisibleInApp: boolean;
  //other
  //   images: Media[];
  //   conversationMessages: ConversationMessage[];
  productCategory: ProductCategory; //main
  //   productCustomFields: ProductCustomField[];
  //   productVariations: ProductVariation[];
  //   productTags: ProductTag[];
  //   likedProducts: LikedProduct[];
  //   viewedProducts: ViewedProduct[];
  //   warehouses: Warehouse[];
  //   flashSaleCampaignDetails: FlashSaleCampaignDetail[];
  //   couponCampaignDetails: CouponCampaignDetail[];
  //   customerCouponDetails: CustomerCouponDetail[];
  //   promotionCampaignDetails: PromotionCampaignDetail[];
  //   orderDetails: OrderDetail[];
  //   transportConfigs: TransportConfig[];
  //   refCustomers: RefCustomer[];
  //   productVariationDetailValues: ProductVariationDetailValue[];
  //   banners: Banner[];
  store: Store;
  //   deletedBy: Employee;
  //   productTax: ProductTax;
}
