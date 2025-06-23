import axios from "axios";

// Create axios instance
const axiosClient = axios.create({
  baseURL: "https://shop.staging.bmdapp.store:3249/v1",
  headers: {
    "Content-Type": "application/json",
    namespace: "hoangphuc",
    lang: "hoangphuc",
  },
});

// Function to get all products
export const getProducts = async (params?: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get("/customer/product", {
      headers: {
        token: token || "",
      },
      params,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Function to get product detail by ID
export const getProductById = async (productId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get(`/customer/product/${productId}`, {
      headers: {
        token: token || "",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};