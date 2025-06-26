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
import "../../../styles/override.css";
import { formatPrice } from "../../../utils/money";

const CategoryProducts = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterMobileVisible, setFilterMobileVisible] =
    useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const [categoryPages, setCategoryPages] = useState<{ [key: number]: number }>(
    {}
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchInputRef = useRef<any>(null);

  const PRODUCTS_PER_PAGE = 4; // Số sản phẩm hiển thị mỗi trang

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

          // Khởi tạo trang đầu tiên cho mỗi danh mục
          const initialPages: { [key: number]: number } = {};
          categoriesArray.forEach((category) => {
            initialPages[category.id] = 0;
          });
          setCategoryPages(initialPages);
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

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      // Reset trang về đầu khi tìm kiếm
      const resetPages: { [key: number]: number } = {};
      categories.forEach((category) => {
        resetPages[category.id] = 0;
      });
      setCategoryPages(resetPages);
    },
    [categories]
  );

  const handleCategorySelect = useCallback(
    (categoryId: number) => {
      setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
      // Reset trang về đầu khi thay đổi danh mục
      const resetPages: { [key: number]: number } = {};
      categories.forEach((category) => {
        resetPages[category.id] = 0;
      });
      setCategoryPages(resetPages);
    },
    [selectedCategory, categories]
  );

  // Hàm chuyển trang cho danh mục
  const handlePageChange = useCallback(
    (categoryId: number, direction: "prev" | "next") => {
      setCategoryPages((prev) => {
        const currentPage = prev[categoryId] || 0;
        const newPage =
          direction === "next" ? currentPage + 1 : Math.max(0, currentPage - 1);
        return {
          ...prev,
          [categoryId]: newPage,
        };
      });
    },
    []
  );

  // Thêm hàm helper cho tìm kiếm linh hoạt
  const isMatch = useCallback((text: string, searchTerm: string) => {
    const normalizedText = text.toLowerCase();
    const normalizedSearch = searchTerm.toLowerCase().trim();

    // Tìm kiếm chính xác
    if (normalizedText.includes(normalizedSearch)) {
      return true;
    }

    // Tìm kiếm theo từng từ
    const searchWords = normalizedSearch.split(/\s+/);
    if (searchWords.every((word) => normalizedText.includes(word))) {
      return true;
    }

    // Tìm kiếm từ đầu của từ (ví dụ: "Sa" tìm được "Sách")
    const textWords = normalizedText.split(/\s+/);
    return textWords.some((word) =>
      searchWords.some((searchWord) => word.startsWith(searchWord))
    );
  }, []);

  const filteredCategories = useMemo(() => {
    return categories
      .filter((category) => {
        if (selectedCategory && category.id !== selectedCategory) {
          return false;
        }

        if (searchTerm) {
          return category.products.some((product) =>
            isMatch(product.name, searchTerm)
          );
        }

        return true;
      })
      .map((category) => {
        if (searchTerm) {
          return {
            ...category,
            products: category.products.filter((product) =>
              isMatch(product.name, searchTerm)
            ),
          };
        }
        return category;
      });
  }, [categories, searchTerm, selectedCategory, isMatch]);

  // Hàm toggle hiển thị tất cả sản phẩm trong danh mục
  const toggleExpandCategory = useCallback((categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
        // Reset về trang đầu khi thu gọn
        setCategoryPages((prevPages) => ({
          ...prevPages,
          [categoryId]: 0,
        }));
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  // Hàm lấy sản phẩm theo trang (cập nhật để xử lý trường hợp mở rộng)
  const getProductsForPage = useCallback(
    (category: ProductCategory) => {
      // Nếu danh mục được mở rộng, hiển thị tất cả sản phẩm
      if (expandedCategories.has(category.id)) {
        return category.products;
      }

      const currentPage = categoryPages[category.id] || 0;
      const startIndex = currentPage * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;
      return category.products.slice(startIndex, endIndex);
    },
    [categoryPages, expandedCategories]
  );

  // Hàm kiểm tra có thể chuyển trang không
  const canNavigate = useCallback(
    (category: ProductCategory, direction: "prev" | "next") => {
      const currentPage = categoryPages[category.id] || 0;
      const totalPages = Math.ceil(
        category.products.length / PRODUCTS_PER_PAGE
      );

      if (direction === "prev") {
        return currentPage > 0;
      } else {
        return currentPage < totalPages - 1;
      }
    },
    [categoryPages]
  );

  const renderCategorySidebar = useCallback(
    () => (
      <div className="hidden md:block w-64 pr-6 border-r">
        <h3 className="font-bold text-lg mb-4">Danh mục sản phẩm</h3>
        <div className="space-y-2 custom-checkbox">
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
        className="custom-drawer"
      >
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">Danh mục sản phẩm</h3>
          <div className="space-y-3 custom-checkbox">
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
        {/* Thanh tìm kiếm và bộ lọc */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm theo tên sản phẩm
              </label>
              <Input
                ref={searchInputRef}
                placeholder="Nhập tên sản phẩm cần tìm..."
                prefix={<SearchOutlined className="text-gray-400" />}
                onChange={handleSearchChange}
                value={searchTerm}
                className="w-full hover:border-green-500 focus:border-green-600 focus:shadow-green-100"
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

        <div className="flex flex-col md:flex-row gap-6">
          {renderCategorySidebar()}
          <div className="flex-1 text-center py-12">
            <p className="text-gray-500">Không tìm thấy sản phẩm phù hợp.</p>
          </div>
        </div>
        {renderMobileFilters()}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm theo tên sản phẩm
            </label>
            <Input
              ref={searchInputRef}
              placeholder="Nhập tên sản phẩm cần tìm..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={handleSearchChange}
              value={searchTerm}
              className="w-full hover:border-green-500 focus:border-green-600 focus:shadow-green-100"
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
          <div className="space-y-8">
            {filteredCategories
              .filter((category) => category.products.length > 0)
              .map((category, index) => {
                const currentPage = categoryPages[category.id] || 0;

                const displayProducts = getProductsForPage(category);
                const isExpanded = expandedCategories.has(category.id);

                return (
                  <div key={category.id}>
                    {/* Thêm đường ngăn cách giữa các danh mục */}
                    {index > 0 && (
                      <div className="border-t border-gray-200 mb-8"></div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-4">
                          <h2 className="text-xl font-bold text-gray-800">
                            {category.name}
                          </h2>
                          {!isExpanded && (
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              ({currentPage * PRODUCTS_PER_PAGE + 1}-
                              {Math.min(
                                (currentPage + 1) * PRODUCTS_PER_PAGE,
                                category.products.length
                              )}
                              / {category.products.length})
                            </span>
                          )}
                          {isExpanded && (
                            <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                              Hiển thị tất cả {category.products.length} sản
                              phẩm
                            </span>
                          )}
                        </div>
                        {!isExpanded && (
                          <div className="flex gap-2">
                            <Button
                              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                                canNavigate(category, "prev")
                                  ? "bg-green-100 hover:bg-green-200 text-green-600"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                              onClick={() =>
                                handlePageChange(category.id, "prev")
                              }
                              disabled={!canNavigate(category, "prev")}
                            >
                              <LeftOutlined />
                            </Button>
                            <Button
                              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                                canNavigate(category, "next")
                                  ? "bg-green-100 hover:bg-green-200 text-green-600"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                              onClick={() =>
                                handlePageChange(category.id, "next")
                              }
                              disabled={!canNavigate(category, "next")}
                            >
                              <RightOutlined />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayProducts.map((product) => (
                          <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            className="block group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-green-600"
                          >
                            <div className="overflow-hidden border-b">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full aspect-square object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="text-sm font-bold text-gray-800 group-hover:text-green-600 line-clamp-2 h-10 mb-2">
                                {product.name}
                              </h3>
                              {product.description && (
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2 h-8">
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
                                <div className="font-bold text-green-600 text-lg">
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

                      {/* Nút toggle */}
                      {category.products.length > PRODUCTS_PER_PAGE && (
                        <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => toggleExpandCategory(category.id)}
                            className="py-2 px-6 border border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors"
                          >
                            {isExpanded
                              ? `Thu gọn`
                              : `Xem tất cả (${category.products.length})`}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {renderMobileFilters()}
    </div>
  );
};

export default CategoryProducts;
