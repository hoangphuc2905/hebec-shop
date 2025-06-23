import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getProducts } from "../../../api/productApi";
import { message } from "antd";

// Định nghĩa interface dựa trên cấu trúc API trả về
interface Product {
  id: number;
  name: string;
  finalPrice: number;
  image: string;
  description?: string;
  code: string;
  sold?: number;
  productCategory: {
    id: number;
    name: string;
    slug: string;
    icon?: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

const CategoryProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy tất cả sản phẩm
        const response = await getProducts();

        if (response?.data?.products && response.data.products.length > 0) {
          // Nhóm sản phẩm theo danh mục
          const groupedProducts: { [key: number]: Category } = {};

          response.data.products.forEach((product: Product) => {
            const categoryId = product.productCategory?.id;

            if (categoryId && product.productCategory) {
              if (!groupedProducts[categoryId]) {
                // Tạo category mới nếu chưa có
                groupedProducts[categoryId] = {
                  id: categoryId,
                  name: product.productCategory.name,
                  slug: product.productCategory.slug,
                  products: [],
                };
              }

              // Thêm sản phẩm vào danh mục tương ứng
              groupedProducts[categoryId].products.push(product);
            }
          });

          // Chuyển đổi object thành mảng danh mục
          const categoriesArray = Object.values(groupedProducts);
          setCategories(categoriesArray);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.error(
          "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Hiển thị thông báo nếu không có danh mục nào
  if (categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {categories.map((category) => (
        <div key={category.id}>
          {/* Category header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
            <div className="flex gap-2">
              <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                <LeftOutlined />
              </button>
              <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                <RightOutlined />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {category.products.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="block group"
              >
                <div className="overflow-hidden border border-gray-200 rounded-lg mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800 group-hover:text-green-600 line-clamp-2 h-10 mb-1">
                  {product.name}
                </h3>
                <div className="font-medium text-green-600">
                  {formatPrice(product.finalPrice)}
                </div>
                {product.sold && product.sold > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Đã bán: {product.sold}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* "Xem thêm" link nếu có nhiều hơn 4 sản phẩm */}
          {category.products.length > 4 && (
            <div className="text-center mt-6">
              <Link
                to={`/danh-muc/${category.slug}`}
                className="text-green-600 hover:text-green-800 underline"
              >
                Xem thêm
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoryProducts;
