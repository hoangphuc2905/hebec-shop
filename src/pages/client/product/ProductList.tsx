import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import {
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
  FilterOutlined,
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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const searchInputRef = useRef<any>(null);

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

  const formatPrice = useCallback((price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleCategorySelect = useCallback(
    (categoryId: number) => {
      setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    },
    [selectedCategory]
  );

  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) => {
        if (selectedCategory && category.id !== selectedCategory) {
          return false;
        }

        if (searchTerm) {
          return category.products.some((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        return true;
      })
      .map((category) => {
        if (searchTerm) {
          return {
            ...category,
            products: category.products.filter((product) =>
              product.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
          };
        }
        return category;
      });
  }, [categories, searchTerm, selectedCategory]);

  const renderCategorySidebar = useCallback(
    () => (
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
    ),
    [categories, selectedCategory, handleCategorySelect]
  );

  const renderMobileFilters = useCallback(
    () => (
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
    ),
    [categories, selectedCategory, filterMobileVisible, handleCategorySelect]
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
              ref={searchInputRef}
              placeholder="Tìm kiếm sản phẩm..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={handleSearchChange}
              value={searchTerm}
              className="w-full"
              size="large"
            />
          </div>
          <div className="flex gap-2">
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
        {renderCategorySidebar()}

        <div className="flex-1">
          <div className="space-y-12">
            {filteredCategories.map((category) => (
              <div key={category.id}>
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
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="block group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-green-600"
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
                        {product.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2 h-6">
                            {product.description}
                          </p>
                        )}
                        <div className="flex flex-col gap-1">
                          {product.importPrice &&
                            product.importPrice > product.finalPrice && (
                              <div className="text-xs text-gray-400 line-through">
                                {formatPrice(product.importPrice)}
                              </div>
                            )}
                          <div className="font-medium text-green-600 text-lg">
                            {formatPrice(product.finalPrice)}
                          </div>
                        </div>
                        {typeof product.sold !== "undefined" && (
                          <div className="text-xs text-gray-500 mt-1">
                            Đã bán: {product.sold || 0}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                {category.products.length > 8 && (
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

      {renderMobileFilters()}
    </div>
  );
};

export default CategoryProducts;
