import homeImg from "../../../assets/hebec-merchants.png";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  // Dữ liệu cho slideshow banner
  const bannerSlides = [
    {
      id: 1,
      image:
        "https://cdn.xanhsm.com/2025/03/f8dbb5d9-nha-sach-tan-binh-thumb.jpg",
      alt: "Chuyển đổi số Hebec",
    },
    {
      id: 2,
      image:
        "https://cafefcdn.com/thumb_w/640/203337114487263232/2025/5/9/avatar1746772909112-17467729094091375930140.png",
      alt: "Giải pháp giáo dục Hebec",
    },
    {
      id: 3,
      image:
        "https://thanhnien.mediacdn.vn/Uploaded/congson/2022_11_16/sach-2171.jpg",
      alt: "Đổi mới sáng tạo Hebec",
    },
  ];

  // Điều khiển slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  };

  // Tự động chuyển slide
  const startSlideInterval = () => {
    slideInterval.current = setInterval(() => {
      goToNextSlide();
    }, 5000);
  };

  const stopSlideInterval = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  useEffect(() => {
    startSlideInterval();
    return () => stopSlideInterval();
  }, []);

  return (
    <div className="bg-white text-gray-800">
      {/* Banner Slideshow */}
      <section className="relative overflow-hidden">
        <div
          className="relative h-[400px] md:h-[500px] w-full"
          onMouseEnter={stopSlideInterval}
          onMouseLeave={startSlideInterval}
        >
          {/* Slide Controls */}
          <div className="absolute inset-0 flex items-center justify-between z-10 px-4">
            <button
              onClick={goToPrevSlide}
              className="bg-white/70 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors"
              aria-label="Previous slide"
            >
              <LeftOutlined className="text-gray-800" />
            </button>
            <button
              onClick={goToNextSlide}
              className="bg-white/70 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors"
              aria-label="Next slide"
            >
              <RightOutlined className="text-gray-800" />
            </button>
          </div>

          {/* Slides */}
          <div className="h-full">
            {bannerSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  currentSlide === index
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                  <h2 className="text-white text-2xl md:text-3xl font-bold">
                    {slide.title}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section: Lý do chọn Hebec - Giữ nguyên không đổi */}
      <section className="bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-center">
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
              alt="Price"
              className="w-12 mx-auto mb-2"
            />
            <h4 className="font-semibold mb-1">Giá cả phải chăng</h4>
            <p className="text-sm text-gray-600">
              Cung cấp số lượng lớn nên chúng tôi có giá tốt nhất từ nhà sản
              xuất
            </p>
          </div>
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/190/190413.png"
              alt="Partners"
              className="w-12 mx-auto mb-2"
            />
            <h4 className="font-semibold mb-1">Đối tác uy tín</h4>
            <p className="text-sm text-gray-600">
              Hebec là đối tác chính thức của các thương hiệu nổi tiếng như HP &
              Dell, Canon...
            </p>
          </div>
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/190/190420.png"
              alt="Delivery"
              className="w-12 mx-auto mb-2"
            />
            <h4 className="font-semibold mb-1">Vượt trên mong đợi</h4>
            <p className="text-sm text-gray-600">
              Hebec sẵn sàng mang lại giải pháp và cung cấp nhanh nhất theo yêu
              cầu
            </p>
          </div>
        </div>
      </section>

      {/* Section: Giới thiệu Hebec */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="rounded overflow-hidden shadow">
            <img
              src={homeImg}
              alt="Hebec Store"
              className="w-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">
              CÔNG TY CP SÁCH VÀ THIẾT BỊ GIÁO DỤC HẢI DƯƠNG
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              HEBEC rất vinh hạnh khi luôn được các bậc cha mẹ, các em học sinh
              gửi gắm niềm tin vào dịch vụ của Nhà sách với hàng ngàn loại sách,
              vở, tài liệu tham khảo, đồ dùng học tập, cấp học sinh, ba lô…
            </p>
            <Link
              to="/ve-chung-toi"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
            >
              Xem thêm
            </Link>
          </div>
        </div>
      </section>

      {/* Các section khác giữ nguyên */}
      <section className="text-center py-12 bg-white">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">10.000+</h2>
        <p className="text-lg font-semibold">
          Là con số khách hàng mà Hebec đã cung cấp dịch vụ
        </p>
      </section>

      <section className="bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Về chúng tôi
          </h2>
          {/* Có thể chèn thêm các đoạn mô tả hoặc icon nếu cần */}
        </div>
      </section>

      {/* Section bản đồ Google Maps - Đã cập nhật */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Chúng tôi luôn sẵn sàng phục vụ 24/7
          </h2>

          {/* Bản đồ full width */}
          <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d26977.061209663752!2d106.330338!3d20.939344!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31359b476a63bf2d%3A0xdd928bd9521d1d44!2sHEBEC%20GROUP!5e1!3m2!1svi!2shk!4v1750652667039!5m2!1svi!2shk"
              className="w-full h-[450px] border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ HEBEC GROUP"
            ></iframe>
          </div>

          {/* Thông tin liên hệ */}
          <div className="mt-8 grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <EnvironmentOutlined className="text-2xl text-green-600 mb-2" />
              <h4 className="font-semibold mb-1">Địa chỉ</h4>
              <p className="text-gray-600">
                27 Minh Khai, P. Trần Hưng Đạo, Hải Dương, 171250, Việt Nam
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <PhoneOutlined className="text-2xl text-green-600 mb-2" />
              <h4 className="font-semibold mb-1">Liên hệ</h4>
              <p className="text-gray-600">Hotline: 0987 654 321</p>
              <p className="text-gray-600">Email: contact@hebec.edu.vn</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <EnvironmentOutlined className="text-2xl text-green-600 mb-2" />
              <h4 className="font-semibold mb-1">Giờ làm việc</h4>
              <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 17:30</p>
              <p className="text-gray-600">Thứ 7: 8:00 - 12:00</p>
              <p className="text-gray-600">Chủ nhật: Nghỉ</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
