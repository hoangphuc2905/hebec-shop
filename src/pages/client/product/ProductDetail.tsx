import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ShareAltOutlined, HeartOutlined } from "@ant-design/icons";
import { Button, Image, Input, message } from "antd";
import { getProductById } from "../../../api/productApi";
import type { Product } from "../../../types/interfaces/product.interface";
import { useStore } from "../../../stores";
import { observer } from "mobx-react-lite";

const ProductDetail: React.FC = observer(() => {
  const { cartStore } = useStore();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("description");
  const [mainImage, setMainImage] = useState<string>("");
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await getProductById(id);

        if (response?.data) {
          const productData = response.data;
          setProduct(productData);

          setMainImage(productData.image);

          const productImages =
            productData.images?.length > 0
              ? [
                  productData.image,
                  ...productData.images.map((img: unknown) =>
                    typeof img === "string" ? img : (img as { url: string }).url
                  ),
                ]
              : [productData.image];

          setThumbnails(productImages);
        } else {
          message.error("Không tìm thấy thông tin sản phẩm");
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin sản phẩm:", error);
        message.error(
          "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("vi-VN");
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleThumbnailClick = (image: string) => {
    setMainImage(image);
  };
  const handleAddToCart = () => {
    if (!product) return;

    cartStore.addToCart(
      {
        id: String(product.id),
        name: product.name,
        price: product.finalPrice,
        importPrice: product.importPrice,
        description: product.description || "",
        image: product.image || "",
      },
      quantity
    );
  };
  const handleBuyNow = () => {
    if (!product) return;

    const token = localStorage.getItem("token");

    if (!token) {
      message.warning("Vui lòng đăng nhập để tiến hành mua hàng.");
      localStorage.setItem("redirectAfterLogin", `/products/${product.id}`);
      localStorage.setItem(
        "buyNowProduct",
        JSON.stringify({
          productId: product.id,
          quantity: quantity,
        })
      );
      navigate("/login");
      return;
    }

    // Truyền dữ liệu qua state thay vì URL params
    navigate("/order", {
      state: {
        directPurchase: true,
        product: {
          id: String(product.id),
          name: product.name,
          price: product.finalPrice,
          image: product.image || "",
        },
        quantity: quantity,
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p>Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6">
        <ol className="list-none p-0 flex flex-wrap items-center">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-green-600">
              Trang chủ
            </Link>
            <span className="mx-2 text-gray-400">›</span>
          </li>
          {product.productCategory && (
            <>
              <li className="flex items-center">
                <Link
                  to={`/danh-muc/${product.productCategory.slug}`}
                  className="text-gray-500 hover:text-green-600"
                >
                  {product.productCategory.name}
                </Link>
                <span className="mx-2 text-gray-400">›</span>
              </li>
            </>
          )}
          <li className="flex items-center text-gray-800">{product.name}</li>
        </ol>
      </nav>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {/* Main Image with Ant Design Image */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white flex justify-center">
            <Image.PreviewGroup items={thumbnails}>
              <Image
                src={mainImage}
                alt={product.name}
                width={350}
                height={350}
                className="object-contain"
                rootClassName="max-w-full"
                preview={{
                  toolbarRender: (_, { actions: { onZoomIn, onZoomOut } }) => (
                    <>
                      <button
                        onClick={onZoomIn}
                        className="text-white bg-gray-700/50 hover:bg-gray-700 px-3 py-1 rounded mr-2"
                      >
                        +
                      </button>
                      <button
                        onClick={onZoomOut}
                        className="text-white bg-gray-700/50 hover:bg-gray-700 px-3 py-1 rounded"
                      >
                        -
                      </button>
                    </>
                  ),
                }}
              />
            </Image.PreviewGroup>
          </div>

          {/* Thumbnails */}
          {thumbnails.length > 1 && (
            <div className="flex gap-2 justify-center flex-wrap">
              {thumbnails.map((thumb, index) => (
                <div
                  key={index}
                  className={`border rounded-lg w-16 h-16 overflow-hidden cursor-pointer transition-all
                    ${
                      thumb === mainImage
                        ? "border-green-500 shadow-md"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  onClick={() => handleThumbnailClick(thumb)}
                >
                  <img
                    src={thumb}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>

          {product.brandName && (
            <p className="text-sm text-gray-500 mb-4">
              Thương hiệu: {product.brandName}
            </p>
          )}

          <div className="flex items-center mb-4 space-x-3">
            <div className="flex flex-col">
              {product.importPrice &&
                product.importPrice > product.finalPrice && (
                  <span className="text-sm line-through text-gray-500 mb-1">
                    {formatPrice(product.importPrice)}
                  </span>
                )}
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(product.finalPrice)}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-3 text-gray-700">Số lượng:</span>
            <div className="border border-gray-300 rounded flex items-center mr-4">
              <button
                onClick={decreaseQuantity}
                className="py-2 px-2 border border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors"
              >
                -
              </button>
              <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="w-16 text-center py-1 border-0 focus:outline-none"
              />
              <button
                onClick={increaseQuantity}
                className="py-2 px-2 border border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Sold Count - Styled better */}
          <div className="flex items-center mb-4 py-2 rounded-md ">
            <div className="text-gray-500" />
            <span className="text-sm">
              <span className="text-gray-500">Đã bán:</span>{" "}
              <span className="font-medium text-gray-700">
                {product.sold || 0}
              </span>{" "}
              sản phẩm
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="py-2 px-4 border border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors"
            >
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleBuyNow}
              className="py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
            >
              Mua ngay
            </button>
          </div>

          {/* Share Button */}
          <div className="flex items-center">
            <button className="flex items-center px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-gray-800">
              <ShareAltOutlined className="mr-2" />
              Chia sẻ
            </button>
            <Button className="ml-2 p-2 border border-gray-300 rounded-full hover:border-gray-400">
              <HeartOutlined />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "description"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Mô tả
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {activeTab === "description" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr>
                        <td className="py-2 text-gray-600">Mã sản phẩm</td>
                        <td className="py-2">{product.code}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Danh mục</td>
                        <td className="py-2">
                          {product.productCategory?.name || "N/A"}
                        </td>
                      </tr>
                      {product.brandName && (
                        <tr>
                          <td className="py-2 text-gray-600">Thương hiệu</td>
                          <td className="py-2">{product.brandName}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-2 text-gray-600">Ngày tạo</td>
                        <td className="py-2">
                          {formatDate(product.createdAt)}
                        </td>
                      </tr>
                      {product.store && (
                        <tr>
                          <td className="py-2 text-gray-600">Cửa hàng</td>
                          <td className="py-2">{product.store.name}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-gray-700 whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductDetail;
