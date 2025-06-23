import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
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
    setTimeout(() => {
      const sampleCategories: Category[] = [
        {
          id: 1,
          name: "Nữ Công Gia Chánh - Mẹo Vặt - Cẩm Nang",
          slug: "nu-cong-gia-chanh",
          products: [
            {
              id: 1,
              name: "Trẻ Lâu Đẹp Dáng",
              price: 82000,
              image:
                "https://salt.tikicdn.com/cache/280x280/ts/product/65/ae/44/73256656d447425db7510a9ac5d84a12.jpg",
            },
            {
              id: 2,
              name: "Món Ăn Giúp Bé Khỏe Mạnh & Thông Minh",
              price: 32000,
              image:
                "https://salt.tikicdn.com/cache/280x280/ts/product/c1/64/b2/2cbacd97d8e01786dd7c17052cafdd4c.jpg",
            },
          ],
        },
        {
          id: 2,
          name: "Sách Nấu Ăn Gia Đình",
          slug: "sach-nau-an",
          products: [
            {
              id: 3,
              name: "Mặn Béo Chua Nóng",
              price: 480000,
              image:
                "https://salt.tikicdn.com/cache/280x280/ts/product/45/3b/fc/aa81d0a534b45706ae1eee1e344e80d9.jpg",
            },
            {
              id: 4,
              name: "125 Món Nướng Đặc Sắc",
              price: 34000,
              image:
                "https://salt.tikicdn.com/cache/280x280/ts/product/0f/81/e4/4edcf40f864506b1c41a2d7a7c1e67e8.jpg",
            },
          ],
        },
      ];

      setCategories(sampleCategories);
      setLoading(false);
    }, 500);
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
            {category.products.map((product) => (
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
                  {formatPrice(product.price)}
                </div>
              </Link>
            ))}
          </div>

          {/* "Xem thêm" link */}
          <div className="text-center mt-6">
            <Link
              to={`/danh-muc/${category.slug}/tat-ca`}
              className="text-green-600 hover:text-green-800 underline"
            >
              Xem thêm
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryProducts;
