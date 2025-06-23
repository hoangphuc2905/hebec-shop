export const OrderReceiptStatus = {
  Pending: "PENDING",
  Complete: "COMPLETE",
} as const;

export type OrderReceiptStatus = typeof OrderReceiptStatus[keyof typeof OrderReceiptStatus];
