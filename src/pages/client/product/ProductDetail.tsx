import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ShareAltOutlined, HeartOutlined } from "@ant-design/icons";
import { Image } from "antd";

interface Product {
  id: string;
  name: string;
  price: number;
  publisher: string;
  stock: number;
  mainImage: string;
  thumbnails: string[];
  details: {
    publisher: string;
    publishDate: string;
    size: string;
    pages: number;
    manufacturer: string;
  };
  description: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("description");
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    // Mô phỏng API call
    setTimeout(() => {
      const productData = {
        id: "1",
        name: "143 Món Khai Vị Hấp Dẫn",
        price: 37000,
        publisher: "Gia Bảo",
        stock: 50,
        mainImage:
          "https://sobee.vn/site/wp-content/uploads/2023/06/Screenshot-140.png",
        thumbnails: [
          "https://sobee.vn/site/wp-content/uploads/2023/06/Screenshot-140.png",
          "https://salt.tikicdn.com/cache/280x280/ts/product/65/ae/44/73256656d447425db7510a9ac5d84a12.jpg",
          "https://salt.tikicdn.com/cache/280x280/ts/product/c1/64/b2/2cbacd97d8e01786dd7c17052cafdd4c.jpg",
        ],
        details: {
          publisher: "Công ty phát hành",
          publishDate: "15/05/2021 00:00:00",
          size: "13 x 20.5 cm",
          pages: 189,
          manufacturer: "Nhà xuất bản Hà Nội",
        },
        description: `143 Món Khai Vị Hấp Dẫn

Món ăn chơi của món khai vị kích thích ngon miệng và vào ăn cơm giúp ngày của bạn ngon ăn nhưng. Món ăn được chế biến bằng
truyền thống gia truyền nấu hương thanh và nhẹ mùi vị nước mắm và lá chanh phong phú và cơi nhúng mau rau chùm ngò thái xắt lát
nấu. Ánh trực tiếp từ lò nướng đặt trên miếng khai vị trên phong phủ xử bán hàng rộng, giải nhu người điển tại làm trộn chém giòn đè nhưm
rơi trước khi vào bữa chính ninh giai.

Cuốn sách giới thiệu công thức 143 món khai vị ngon miệng, giúp phần bữa phong phú thực đơn bữa tiệc. Các món ăn được chế
biến ở nhiều...

- Món salad (salad đầu mùa ngô, salad tánh, salad hàm suốn, salad hạt hướng đạt)

- Món súp (súp hamburger, súp cà bắt cảui thịt, súp gấc, súp mì cua, súp tôm rau)

- Món về món các hương thiên (cỗn nộm dưới, gỏi cá trích, babao cá nhồi ổi, trứ ăn, bột, bánh hỏi gà)...

Công thức chế biến được trình bày đơn giản, dễ hiểu. Bày là cuốn sách giúp độc giả có thêm nhiều lựa chọn món trong việc nấu ăn
hàng ngày.`,
      };

      setProduct(productData);
      setMainImage(productData.mainImage);
      setLoading(false);
    }, 500);
  }, [id]);

  // Format giá tiền theo VND
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  // Xử lý thay đổi số lượng
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

  // Xử lý khi click vào thumbnail
  const handleThumbnailClick = (image: string) => {
    setMainImage(image);
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  // Xử lý mua ngay
  const handleBuyNow = () => {
    alert(`Chuyển đến trang thanh toán với ${quantity} sản phẩm`);
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
              Home
            </Link>
            <span className="mx-2 text-gray-400">›</span>
          </li>
          <li className="flex items-center text-gray-800">{product.name}</li>
        </ol>
      </nav>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {/* Main Image with Ant Design Image */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white flex justify-center">
            <Image.PreviewGroup items={[mainImage, ...product.thumbnails]}>
              <Image
                src={mainImage}
                alt={product.name}
                width={350}
                height={350}
                className="object-contain"
                rootClassName="max-w-full"
                preview={{
                  toolbarRender: (
                    _,
                    { transform: { scale }, actions: { onZoomIn, onZoomOut } }
                  ) => (
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
          <div className="flex gap-2 justify-center flex-wrap">
            {product.thumbnails.map((thumb, index) => (
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
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {product.name}
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Nhà xuất bản: {product.publisher}
          </p>

          <div className="text-xl font-bold text-green-600 mb-4">
            {formatPrice(product.price)}
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Số lượng: {product.stock}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <div className="border border-gray-300 rounded flex items-center mr-4">
              <button
                onClick={decreaseQuantity}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="w-12 text-center py-1 border-0 focus:outline-none"
              />
              <button
                onClick={increaseQuantity}
                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
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
            <button className="ml-2 p-2 border border-gray-300 rounded-full hover:border-gray-400">
              <HeartOutlined />
            </button>
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
                        <td className="py-2 text-gray-600">
                          Công ty phát hành
                        </td>
                        <td className="py-2">{product.details.publisher}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Ngày phát hành</td>
                        <td className="py-2">{product.details.publishDate}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Kích thước</td>
                        <td className="py-2">{product.details.size}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Số trang</td>
                        <td className="py-2">{product.details.pages}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-600">Nhà xuất bản</td>
                        <td className="py-2">{product.details.manufacturer}</td>
                      </tr>
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
};

export default ProductDetail;
