/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Hàm gọi API đăng ký
export const registerCustomer = async (data: any) => {
  try {
    const response = await axiosClient.post("/customer/auth/register", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Hàm gọi API đăng nhập
export const loginCustomer = async (data: any) => {
  try {
    const response = await axiosClient.post("/customer/auth/login", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Hàm gọi API đăng xuất
export const logoutCustomer = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Không tìm thấy token");
    }

    const response = await axiosClient.post(
      "/customer/auth/logout",
      {}, // Empty body but using object instead of null
      {
        headers: {
          token: token,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Logout API error:", error);
    throw error.response?.data || { message: "Lỗi khi đăng xuất" };
  }
};

// Hàm gọi API lấy thông tin khách hàng
export const getCustomerProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosClient.get("/customer/auth/profile", {
      headers: {
        token: token || "",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Hàm cập nhật thông tin khách hàng
export const updateCustomerProfile = async (data: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosClient.put("/customer/auth/profile", data, {
      headers: {
        token: token || "",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Hàm lấy danh sách khách hàng cho admin
export const getCustomerList = async (params?: any) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axiosClient.get("/store/customer", {
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

// Thêm khách hàng mới (admin)
export const addCustomer = async (data: any) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axiosClient.post("/store/customer", data, {
      headers: {
        token: token || "",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Cập nhật thông tin khách hàng (admin)
export const updateCustomer = async (customerId: string, data: any) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axiosClient.put(
      `/store/customer/${customerId}`,
      data,
      {
        headers: {
          token: token || "",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Xoá khách hàng (admin)
export const deleteCustomer = async (customerId: string) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axiosClient.delete(`/store/customer/${customerId}`, {
      headers: {
        token: token || "",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Hàm lấy lên city
export const getCities = async () => {
  try {
    const response = await axiosClient.get("/customer/city");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

// Hàm lấy lên district theo parentCode
export const getDistricts = async (parentCode: number) => {
  try {
    const response = await axiosClient.get("/customer/district", {
      params: {
        parentCode: parentCode,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};

export const getWards = async (parentCode: number) => {
  try {
    const response = await axiosClient.get("/customer/ward", {
      params: {
        parentCode: parentCode,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};
