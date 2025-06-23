import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://shop.staging.bmdapp.store:3249/v1",
  headers: {
    "Content-Type": "application/json",
    namespace: "hoangphuc",
    lang: "hoangphuc",
    version: "0.0.89",
  },
});

// Lấy danh sách danh mục
export const getCategories = async (params?: any) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axiosClient.get("/store/productCategory", {
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

// Thêm danh mục mới
export const addCategory = async (data: any) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axiosClient.post("/store/category", data, {
      headers: {
        token: token || "",
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Cập nhật danh mục
export const updateCategory = async (id: string, data: any) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axiosClient.put(`/store/category/${id}`, data, {
      headers: {
        token: token || "",
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Xóa danh mục
export const deleteCategory = async (id: string) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axiosClient.delete(`/store/category/${id}`, {
      headers: {
        token: token || "",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};
