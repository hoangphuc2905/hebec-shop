import type { Store } from "./store.interface";

export interface Staff {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  username: string;
  password: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  isBlocked: boolean;
  companyName: string; //đơn vị chủ quản
  isStrict: boolean; //true: phải xác thực OTP
  deviceId: string;
  //relations
  store: Store;
  inventories: Inventory[];
  completedInventories: Inventory[];
  conversations: Conversation[];
  oneSignals: OneSignal[];
  benefitPackageOrders: BenefitPackageOrder[];
  role: Role;
  conversationParticipants: ConversationParticipant[];
}
