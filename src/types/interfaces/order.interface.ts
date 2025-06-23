import type { Store } from "antd/es/form/interface";
import type { Staff } from "./staff.interface";
import type { OrderReceiptStatus } from "../enums/orderReceiptStatus.enum";
import type { City, Customer, District, Ward } from "./customer.interface";
import type { Product } from "./product.interface";

export interface OrderProductVariation {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  parentName: string;
  childName: string;
  finalPrice: number;
  orderDetail: OrderDetail;
}

export interface OrderProductTax {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  name: string;
  value: number;
  description: string;
  moneyTax: number;
  order: Order;
  //   productTax: ProductTax;
}

export interface OrderCustomFieldData {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  label: string;
  dataInputType: string;
  order: Order[];
  orderCustomField: OrderCustomField;
}

export interface OrderCustomField {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  label: string;
  enabled: boolean;
  //   inputType: InputType;
  dataInputType: string;
  require: boolean;
  store: Store;
  orderCustomFieldDatas: OrderCustomFieldData[];
}

export interface BenefitPackageOrder {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  name: string;
  description: string;
  price: number;
  expiredAt: number; // ngày hết hạn
  expireBeforeExtend: number;
  expirationDate: number; // hạn sử dụng (tháng)
  isTest: boolean; //true: gói dùng thử
  //   benefitPackage: BenefitPackage;
  store: Store;
  staff: Staff;
}

export interface OrderReceipt {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  status: OrderReceiptStatus;
  companyName: string; //tên đơn vị
  taxCode: string;
  address: string;
  completedAt: number;
  order: Order;
  city: City;
  district: District;
  ward: Ward;
  //   completedEmployee: Employee;
  store: Store;
}

export interface OrderLog {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  //   createFrom: OrderLogCreateFrom;
  //   type: OrderLogType;
  //   status: OrderStatus;
  prevOrderJson: string;
  currentOrderJson: string;
  order: Order;
  staff: Staff;
  customer: Customer;
}

export interface OrderDetail {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  name: string; //diễn giải
  price: number; //giá gốc
  finalPrice: number; //đơn giá sau giảm giá
  discountFlashSale: number; //giảm tiền trên
  manualDiscount: number;
  discount: number; //giảm trên promotion
  discountCoupon: number; //giảm trên coupon
  isGift: boolean; //true: hàng tặng, khuyến mãi
  quantity: number;
  weight: number;
  savingPoint: number; //
  moneyTax: number; // tổng tiền thuế của sản phẩm
  percentTax: number; // Phần trăm thuế của sản phẩm
  nameTax: string; //  tên thuế của sản phẩm
  isAffiliate: boolean; //sp dc tiếp thị
  //biến thể
  isVariantProduct: boolean; //true: product có biến thể
  variationName1: string; //tên group biến thể 1
  variationName2: string; //tên group biến thể 2
  variationValue1: string; //giá trị biến thể 1
  variationValue2: string; //giá trị biến thể 2
  //end - biến thể
  //custom
  product: Product;
  order: Order;
  orderGift: Order;
  children: OrderDetail[];
  orderProductVariations: OrderProductVariation[];
  parent: OrderDetail;
  //   productVariation: ProductVariation;
  //   flashSaleCampaignDetail: FlashSaleCampaignDetail;
  //   couponCampaignDetail: CouponCampaignDetail;
  //   promotionCampaignDetail: PromotionCampaignDetail; //khuyến mãi giảm giá
  //   giftPromotionCampaignDetail: PromotionCampaignDetail; //khuyến mãi tặng kèm4
  //   productVariationDetailValue: ProductVariationDetailValue;
  refCustomer: Customer;
  // console.log('order detail assign productVariationDetailValue', productVariationDetailValue);
  //flash sale
  //promotion
}

export interface Order {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  code: string;
  privateCode: string;
  //bảo kim
  baoKimOrderId: string;
  baoKimPaymentUrl: string;
  baoKimDataToken: string; //data baokim call hook xác nhận giao dịch
  zaloAppSchema: string;
  //
  //   syncChannel: OrderSyncChannel;
  syncStatus: string;
  syncStatusText: string;
  syncId: string;
  syncCode: string;
  transportCode: string; //mã vận đơn
  //   transportStatus: EDeliveryStatus; //
  transportShipFee: number;
  transportInsuranceFee: number;
  isHasPoint: boolean;
  note: string; //
  //   requiredNote: RequiredNote; //ghi chú của GHN
  length: number; //thông số dành cho đơn ship
  width: number; //thông số dành cho đơn ship
  height: number; //thông số dành cho đơn ship
  //   paymentMethod: EPaymentType;
  //   deliveryType: EDeliveryType;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  //   status: OrderStatus;
  //   paymentStatus: PaymentStatus;
  subTotalMoney: number; //tạm tính
  moneyProductOrigin: number; //tiền sp chưa bao gồm khuyến mãi
  moneyProduct: number;
  moneyVat: number;
  moneyTax: number;
  vatPercent: number;
  shipFee: number; //phí v/c
  distance: number; //dvt: km
  moneyFinal: number; //Tiền khách cần trả
  totalMoney: number; //tổng tiền
  paidPoint: number; //số điểm đã thanh toán
  totalWeight: number; //tổng cân nặng (dvt: gram)
  moneyDiscount: number; //giảm giá tiền hàng cho promotion
  moneyDiscountCoupon: number; //giảm giá tiền hàng cho promotion
  moneyDiscountShipFee: number; //giảm trừ phí ship
  storeShipFee: number; //cửa hàng chịu phí ship (case free ship)
  moneyDiscountFlashSale: number; //tổng tiền giảm từ flash sale
  totalMoneyTax: number; //tổng tiền thuế
  moneyAffiliate: number; //tổng tiền chiết khấu khi chia sẻ thành công sản phẩm
  totalPoints: number; //điểm nhận đc khi hoàn thành đơn hàng
  totalRefPoints: number; //điểm hoa hồng nhận đc khi người được chia sẻ hoàn thành đơn hàng
  pointRate: number; //tỉ lệ hoàn điểm: 0 -> 1;
  isRated: boolean; //đơn đã đánh giá
  rewardPoints: number; //số điểm nhận khi đánh giá đơn
  estimatedDeliveryFromAt: number; //thời gian dự kiến giao hàng
  estimatedDeliveryAt: number; //thời gian dự kiến giao hàng
  isReceiveAtStore: boolean; //true: nhận hàng tại cửa hàng, phí ship = 0
  //   cancelBy: OrderCancelBy;
  //   deliveryStatus: DeliveryStatus;
  isCustomerConfirm: boolean;
  isUpdateAgent: boolean;
  completedAt: number;
  isReceiptTax: boolean; //true: có xuất hóa đơn
  isFreeShip: boolean;
  isCalcManual: boolean; //true: đã chỉnh sửa đơn bằng tay
  transportPreviewUrl: string;
  deliveryDate: string; //format: YYYY-MM-DD. NGày hẹn giao hàng
  isQuickDelivery: boolean;
  zaloOrderId: string;
  //custom
  //   createdEmployee: Employee; //nv tạo đơn
  customer: Customer;
  //   onlinePayment: OnlinePayment;
  details: OrderDetail[];
  gifts: OrderDetail[];
  //   productRates: ProductRate[];
  orderLogs: OrderLog[];
  orderReceipt: OrderReceipt; //thông tin nhận hóa đơn
  receiverCity: City;
  receiverDistrict: District;
  receiverWard: Ward;
  senderCity: City;
  senderDistrict: District;
  senderWard: Ward;
  //   depot: Depot;
  //   inventories: Inventory[];
  eager: true;
  //   couponCampaign: CouponCampaign; //coupon đc apply
  //   promotionCampaigns: PromotionCampaign[]; //
  //   customerCoupon: CustomerCoupon;
  canceledStaff: Staff;
  canceledCustomer: Customer;
  //   giftedCustomerCoupon: CustomerCoupon;
  refCustomer: Customer;
  //   transport: Transport;
  //   employeeUpdated: Employee;
  orderCustomFieldDatas: OrderCustomFieldData[];
  orderProductTaxs: OrderProductTax[];
  //   customerAffiliates: RefCustomer[]; //lịch sử tiếp thị
  //   fileAttaches: FileAttach[];
  // METHOD
  //nhận hàng tại cửa hàng
  //cấu hình giao cho quận huyện
  //tìm theo district
  //phí ship
  //end - phí ship
  //free ship
  //cửa hàng chịu phí ship
  //handle promotion
  //validate promotion
  //end - validate promotion
  //promotion gift
  //tặng kèm trên từng sp
  //promotion tặng quà
  //áp dụng khuyến mãi
  //tặng kèm trên đơn
  //limit 1 đơn 1 k.mãi
  //end - tặng kèm trên đơn
  //giảm phí ship
  //limit 1 đơn 1 k.mãi
  //end - giảm phí ship
  //giảm tiền trực tiếp
  //end - giảm tiền trực tiếp
  //
  //handle coupon
  //*valiate coupon
  //tính tiền giảm coupon
  //
  //
  //
  //
  //check đã sử dụng coupon đc tặng chưa
  //đơn hàng của khách
  //tổng đơn hàng
  //check coupon cá nhân
  //
  // sendMsgTelegram(`[calcPointRefund] CH "${this.store.name}" Khách hàng ${this.customer.fullName} - ${this.customer.id} không có hạng để tính điểm`)
}
