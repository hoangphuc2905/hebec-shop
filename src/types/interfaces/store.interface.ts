import type { Staff } from "./staff.interface";

export interface Store {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  code: string;
  namespace: string; //namespace
  balance: number;
  name: string;
  shopId: number;
  phone: string;
  email: string;
  // createdBy: UserType
  // type: StoreType
  avatar: string; //hình ảnh chính của cửa hàng
  address: string;
  isEnabledUpdateAgent: boolean; // cho phép thay đổi đại lượng đơn hàng ( theo đơn vị quy đổi )
  lat: number;
  lng: number;
  //dynamic configuration
  primaryColor: string; //màu chủ đạo
  appPackageName: string;
  appName: string;
  facebookAppId: string;
  googleAppId: string;
  schemaApp: string;
  loginImageBackground: string; // hình ảnh nền màn hình login trên mobile
  splashImage: string; //hình ảnh khởi động app
  //end - dynamic configuration
  //zalo
  zaloAppId: string;
  zaloMiniAppId: string;
  zaloOAId: string;
  zaloOAName: string;
  zaloOAAvatar: string;
  zaloAppApiKey: string;
  zaloAppSchema: string;
  isDev: boolean;
  isTest: boolean; //true: đang dùng thử
  expiredAt: number; //hạn dùng
  //
  crawlCount: number; // số lần crawl
  totalCOD: number; // tổng số tiền COD vận chuyển mà store có
  currentCOD: number; // tổng số tiền COD vận chuyển còn lại
  pendingCOD: number; // tổng số tiền COD đang pending chờ rút
  enableRemind: boolean;
  isRequiredPhone: boolean;
  isBlocked: boolean;
  kiotVietClientKey: string;
  kiotVietSecretKey: string;
  kiotVietRetailer: string;
  kiotVietHookUrl: string;
  kiotVietHookId: string;
  isVerifiedKiotViet: boolean;
  kiotVietBranchId: string;
  kiotVietSaleChannelId: string;
  //custom
  staffs: Staff[];
  createdStaff: Staff;
  // depots: Depot[]
  // inventories: Inventory[]
  // area: Area
  // city: City
  // district: District
  // ward: Ward
  // benefitPackage: BenefitPackage
  // transports: Transport[]
  // conversations: Conversation[]
  // orders: Order[]
  // promotionCampaigns: PromotionCampaign[]
  // flashSaleCampaigns: FlashSaleCampaign[]
  // couponCampaigns: CouponCampaign[]
  // configurations: Configuration[]
  // likeProducts: LikedProduct[]
  // viewedProducts: ViewedProduct[]
  // branches: Branch[]
  // employees: Employee[]
  // productCategories: ProductCategory[]
  // products: Product[]
  // customFields: CustomField[]
  // customers: Customer[]
  // roles: Role[]
  // popups: Popup
  // quickMessages: QuickMessage[]
  // customerFilters: CustomerFilter[]
  // benefitPackageOrders: BenefitPackageOrder[]
  // messageTemplates: MessageTemplate[]
  // deletedBy: Staff
  // banners: Banner[]
  // storeContentDefines: StoreContentDefine[]
  // onlinePayments: OnlinePayment[]
  // customerRanks: CustomerRank[]
  // productTags: ProductTag[]
  // newsTags: NewsTag[]
  // upgradeRankHistories: UpgradeRankHistory[]
  // groupCustomers: GroupCustomer[]
  // transportConfigs: TransportConfig[]
  // orderCustomFields: OrderCustomField[]
  // customerFollowers: CustomerFollower[]
  // storePackages: StorePackage[]
  // znsTemplates: ZNSTemplate[]
  // transportTransactions: StoreTransaction[]
  // zaloOAAccount: ZaloOA
  // extendPermissions: Permission[] //các quyền bổ sung, mở rộng
}
