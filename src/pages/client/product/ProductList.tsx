import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  AppstoreOutlined,
  FilterOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { getProducts } from "../../../api/productApi";
import {
  Button,
  Input,
  Drawer,
  message,
  Checkbox,
  Divider,
  Skeleton,
} from "antd";
import type { Product } from "../../../types/interfaces/product.interface";
import type { ProductCategory } from "../../../types/interfaces/productCategory.interface";

const CategoryProducts = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterMobileVisible, setFilterMobileVisible] =
    useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await getProducts();

        if (response?.data?.products && response.data.products.length > 0) {
          const groupedProducts: { [key: number]: ProductCategory } = {};

          response.data.products.forEach((product: Product) => {
            const categoryId = product.productCategory?.id;

            if (categoryId && product.productCategory) {
              if (!groupedProducts[categoryId]) {
                // Tạo một danh mục mới nếu chưa có
                groupedProducts[categoryId] = {
                  ...product.productCategory,
                  products: [],
                };
              }

              groupedProducts[categoryId].products.push(product);
            }
          });

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const filteredCategories = categories.filter((category) => {
    if (selectedCategory && category.id !== selectedCategory) {
      return false;
    }

    if (searchTerm) {
      return category.products.some((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return true;
  });

  const renderCategorySidebar = () => (
    <div className="hidden md:block w-64 pr-6 border-r">
      <h3 className="font-bold text-lg mb-4">Danh mục sản phẩm</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center">
            <Checkbox
              checked={selectedCategory === category.id}
              onChange={() => handleCategorySelect(category.id)}
              className="text-gray-700 hover:text-green-600 cursor-pointer"
            >
              {category.name} ({category.products.length})
            </Checkbox>
          </div>
        ))}
      </div>

      <Divider />
    </div>
  );

  const renderMobileFilters = () => (
    <Drawer
      title="Lọc sản phẩm"
      placement="left"
      onClose={() => setFilterMobileVisible(false)}
      open={filterMobileVisible}
      width={300}
    >
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3">Danh mục sản phẩm</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <Checkbox
                checked={selectedCategory === category.id}
                onChange={() => handleCategorySelect(category.id)}
              >
                {category.name} ({category.products.length})
              </Checkbox>
            </div>
          ))}
        </div>
      </div>

      <Divider />
    </Drawer>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="hidden md:block w-64">
            <Skeleton active paragraph={{ rows: 10 }} />
          </div>
          <div className="flex-1">
            <Skeleton active paragraph={{ rows: 3 }} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} active paragraph={{ rows: 3 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredCategories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {renderCategorySidebar()}
          <div className="flex-1 text-center py-12">
            <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={handleSearch}
              value={searchTerm}
              className="w-full"
              size="large"
            />
          </div>

          <div className="flex gap-2">
            <div className="hidden md:flex gap-1">
              <Button
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode("grid")}
                type={viewMode === "grid" ? "primary" : "default"}
                size="large"
                className={viewMode === "grid" ? "bg-green-600" : ""}
              />
              <Button
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode("list")}
                type={viewMode === "list" ? "primary" : "default"}
                size="large"
                className={viewMode === "list" ? "bg-green-600" : ""}
              />
            </div>

            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterMobileVisible(true)}
              className="md:hidden"
              size="large"
            >
              Lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - ẩn trên mobile */}
        {renderCategorySidebar()}

        {/* Danh sách sản phẩm */}
        <div className="flex-1">
          <div className="space-y-12">
            {filteredCategories.map((category) => (
              <div key={category.id}>
                {/* Category header */}
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                  <h2 className="text-xl font-bold text-gray-800">
                    {category.name}
                  </h2>
                  <div className="flex gap-2">
                    <Button className="bg-gray-100 hover:bg-gray-200 flex items-center justify-center h-8 w-8 rounded-full">
                      <LeftOutlined />
                    </Button>
                    <Button className="bg-gray-100 hover:bg-gray-200 flex items-center justify-center h-8 w-8 rounded-full">
                      <RightOutlined />
                    </Button>
                  </div>
                </div>

                {/* Products Grid */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {category.products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="block group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="overflow-hidden border-b">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-800 group-hover:text-green-600 line-clamp-2 h-10 mb-2">
                            {product.name}
                          </h3>
                          <div className="font-medium text-green-600 text-lg">
                            {formatPrice(product.finalPrice)}
                          </div>
                          {product.sold && product.sold > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              Đã bán: {product.sold}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {category.products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="flex gap-4 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-3 group"
                      >
                        <div className="w-32 h-32 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-800 group-hover:text-green-600 mb-2">
                            {product.name}
                          </h3>
                          <div className="font-medium text-green-600 text-lg">
                            {formatPrice(product.finalPrice)}
                          </div>
                          {product.sold && product.sold > 0 && (
                            <div className="text-sm text-gray-500 mt-1">
                              Đã bán: {product.sold}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* "Xem thêm" link nếu có nhiều sản phẩm */}
                {category.products.length > (viewMode === "grid" ? 8 : 5) && (
                  <div className="text-center mt-6">
                    <Link
                      to={`/danh-muc/${category.slug}`}
                      className="inline-block bg-white hover:bg-gray-50 text-green-600 border border-green-600 px-4 py-2 rounded-md font-medium hover:text-green-700 transition-colors"
                    >
                      Xem thêm sản phẩm
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drawer bộ lọc cho mobile */}
      {renderMobileFilters()}
    </div>
  );
};

export default CategoryProducts;
