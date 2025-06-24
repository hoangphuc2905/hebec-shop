export type EPaymentType =
  | "BALANCE" //thanh toán bằng điểm
  | "ONLINE" //thanh toán online
  | "COD" //thanh toán khi nhận hàng
  | "BAO_KIM"; //thanh toán bảo kim

export const EPaymentType = {
  Balance: "BALANCE" as EPaymentType, //thanh toán bằng điểm
  Online: "ONLINE" as EPaymentType, //thanh toán online
  COD: "COD" as EPaymentType, //thanh toán khi nhận hàng
  BaoKim: "BAO_KIM" as EPaymentType, //thanh toán bảo kim
};
