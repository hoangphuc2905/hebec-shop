import type { Staff } from "./staff.interface";

export interface InventoryCheckDetail {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  quantity: number;
  stock: number; //sl tồn tại thời điểm phát sinh record
  note: string;
  productId: number;
  moneyDiff: number;
  onDelete: "CASCADE";
}

export interface InventoryCheck {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  code: string;
  status: InventoryCheckStatus;
  note: string;
  checkAt: number;
  totalStock: number;
  totalReal: number;
  totalMoneyDiff: number;
  createdEmployee: Employee;
  checkedEmployee: Employee;
  depot: Depot;
  onDelete: "CASCADE";
  store: Store;
}

export interface InventoryDetail {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  quantity: number;
  stock: number; //sl tồn tại thời điểm phát sinh record
  price: number;
  note: string;
  productId: number;
  onDelete: "CASCADE";
  onDelete: "CASCADE";
}

export interface Inventory {
  id: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
  deletedAt: number;
  code: string;
  type: InventoryType;
  status: InventoryStatus;
  note: string;
  completedAt: number;
  staff: Staff;
  employee: Employee;
  completedEmployee: Employee;
  completedStaff: Staff;
  depot: Depot;
  toDepot: Depot; //kho chuyển tới, dành cho phiếu chuyển kho
  onDelete: "CASCADE";
  order: Order;
  store: Store;
}
