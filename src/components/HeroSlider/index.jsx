// src/components/HeroSlider.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const banners = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2000&auto=format&fit=crop"
];

const sideBanners = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrent(current === 0 ? banners.length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === banners.length - 1 ? 0 : current + 1);

  return (
    // Đã thay max-w-[1200px] bằng w-full và px-3 md:px-6 để tạo khoảng cách lề nhỏ trên PC
    <div className="w-full mx-auto px-3 md:px-6 lg:px-8 pt-6">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Main Slider (Chiếm 75% chiều rộng trên PC) */}
        <div className="w-full md:w-[75%] relative overflow-hidden rounded-lg group bg-gray-200 aspect-[2/1] md:aspect-auto md:h-[400px] lg:h-[450px]">
          <div 
            className="flex transition-transform duration-500 ease-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {banners.map((img, index) => (
              <Link key={index}  className="w-full h-full flex-shrink-0 block">
                <img src={img} alt={`Banner ${index}`} className="w-full h-full object-cover" />
              </Link>
            ))}
          </div>

          {/* Controls - Được thiết kế lại thành nút tròn nổi */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 hover:bg-white/90 text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
            <FiChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 hover:bg-white/90 text-gray-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md">
            <FiChevronRight size={24} />
          </button>

          {/* Dots - Nút dài ra khi đang ở slide hiện tại */}
          <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-2">
            {banners.map((_, index) => (
              <div 
                key={index} 
                className={`h-2.5 rounded-full transition-all duration-300 ${current === index ? 'bg-white w-6' : 'bg-white/50 w-2.5'}`}
              />
            ))}
          </div>
        </div>

        {/* Side Banners (Chiếm 25% chiều rộng trên PC) */}
        <div className="w-full md:w-[25%] flex flex-col gap-3 h-[400px] lg:h-[450px] hidden md:flex">
          {sideBanners.map((img, index) => (
            <Link key={index} to="/promotions" className="h-[calc(50%-6px)] rounded-lg overflow-hidden block hover:opacity-90 transition-opacity bg-gray-200 shadow-sm">
              <img src={img} alt="Side Banner" className="w-full h-full object-cover" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;