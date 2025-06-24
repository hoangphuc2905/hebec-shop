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

// Lấy danh sách đơn hàng
export const getOrderList = async (params?: any) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axiosClient.get("/store/order", {
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

// Lấy chi tiết đơn hàng
// export const getOrderDetail = async (id: string) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axiosClient.get(`/store/order/${id}`, {
//       headers: {
//         token: token || "",
//       },
//     });
//     return response.data;
//   } catch (error: any) {
//     throw error.response?.data || { message: "Lỗi không xác định." };
//   }
// };

// // Cập nhật trạng thái đơn hàng
// export const updateOrderStatus = async (id: string, status: string) => {
//   try {
//     const token = localStorage.getItem("adminToken");
//     const response = await axiosClient.patch(
//       `/store/order/${id}/status`,
//       { status },
//       {
//         headers: {
//           token: token || "",
//         },
//       }
//     );
//     return response.data;
//   } catch (error: any) {
//     throw error.response?.data || { message: "Lỗi không xác định." };
//   }
// };

// Tạo đơn hàng mới
export const createOrder = async (orderData: any) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosClient.post("/customer/order", orderData, {
      headers: {
        token: token || "",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Lỗi không xác định." };
  }
};
