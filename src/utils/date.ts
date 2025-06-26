import dayjs from "dayjs";

export const formatDate = (timestamp: number) => {
  return dayjs(timestamp * 1000).format("DD/MM/YYYY HH:mm");
};

export const formatDateVi = (timestamp: number) => {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("vi-VN");
};

export const formatDateString = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // Convert từ timestamp sang milliseconds
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
