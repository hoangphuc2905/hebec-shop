export interface Customer {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  code: string;
  email: string;
  balance: number; // points
  totalBalance: number;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  bio: string;
  isAllowChangeDob: boolean; //false: đã nhận coupon quà sinh nhật -> k đc đổi ngày sinh
  fcmToken: string;
  fcmTokenExpired: number;
  dob: string; //format: Y-m-d
  isActive: boolean; //false : chưa có tên, avatar
  isVerified: boolean; //true: đã verify với e-kyc
  // gender: Gender
  address: string; //
  phone: string;
  notificationBadgeCount: number; //Sl thông báo
  password: string;
  isBlocked: boolean;
  facebookId: string;
  googleId: string;
  appleId: string;
  zaloId: string;
  zaloIdByOA: string; //userId by OA
  resetCode: string;
  source: string;
  cycleBuy: number; //chu kỳ mua hàng, tính bằng ngày
  lastOrderAt: number; //ngày mua cuối cùng
  numOfOrders: number; //sl đơn đã mua, k tính đơn hủy
  isFollowZaloOA: boolean; //true: đã flow zalo OA
  isFirstCouponRegister: boolean; //true: đã nhận coupon
  countRemind: number;
  lastRemindAt: number;
  //custom
  notifications: Notification[];
  viewedNotifications: Notification[]; //notifications da xem
  // likedNews: News[]
  assignedNotifications: Notification[];
  // customerTransactions: CustomerTransaction[]
  // registerCustomerTransactions: CustomerTransaction[]
  // deposits: Deposit[]
  // city: City
  // district: District
  // ward: Ward
  // refCustomer: Customer
  // promotionCampaign: PromotionCampaign
  // oneSignals: OneSignal[]
  // customerRank: CustomerRank
  // deliveryAddresses: DeliveryAddress[]
  // likedProducts: LikedProduct[]
  // viewedProducts: ViewedProduct[]
  // customerCoupons: CustomerCoupon[]
  // seenConversationMessages: ConversationMessage[]
  // ownerConversations: Conversation[]
  // orders: Order[]
  // conversationParticipants: ConversationParticipant[]
  // otp: Otp[]
  // store: Store
  // groupCustomers: GroupCustomer[]
  // giftedCoupons: CouponCampaign[]
  // zaloTraffics: ZaloTraffic[]
  // let where = `order.isDeleted = 0 AND order.status NOT IN (:...statuses) AND order.customerId = :customerId`
  // const prevDate = moment(dates[i - 1]);
  // const currentDate = moment(dates[i])
  // totalDay += currentDate.diff(prevDate, 'days');
}

export interface City {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  name: string;
  slug: string;
  type: string;
  nameWithType: string;
  code: string;
  priority: number;
  // shipFees: ShipFee[];
}

export interface District {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  priority: number;
  parentCode: string;
  code: string;
  pathWithType: string;
  path: string;
  nameWithType: string;
  type: string;
  slug: string;
  name: string;
  otherName: string;
  isBlock: boolean;
  deliveryDay: number; //số ngày ước tính giao hàng
  // shipFees: ShipFee[];
}

export interface Ward {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  priority: number;
  parentCode: string;
  code: string;
  pathWithType: string;
  path: string;
  nameWithType: string;
  type: string;
  slug: string;
  name: string;
}
