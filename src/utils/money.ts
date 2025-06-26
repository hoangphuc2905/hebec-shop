export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
};

export const formatPrice = (price: number) => {
  return price.toLocaleString("vi-VN") + " đ";
};
