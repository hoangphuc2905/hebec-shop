import axios from "axios";

// Tạo instance axios riêng
const axiosAdmin = axios.create({
  baseURL: "https://shop.staging.bmdapp.store:3249/v1/store",
  headers: {
    "Content-Type": "application/json",
    namespace: "hoangphuc",
    lang: "hoangphuc",
  },
});

// Hàm gọi API đăng nhập
export const loginAdmin = async (data: any) => {
  try {
    const response = await axiosAdmin.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};
