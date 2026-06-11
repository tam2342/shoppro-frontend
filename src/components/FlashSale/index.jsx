// src/components/FlashSale.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiZap } from 'react-icons/fi'; 

const FlashSale = ({ products = [], loading }) => { // Gán mặc định products = [] để chống lỗi undefined
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => time.toString().padStart(2, '0');

  return (
    <div className="bg-white rounded-sm shadow-sm border border-blue-50 mt-6">
      
      {/* HEADER FLASH SALE */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-600">
            <FiZap size={24} className="fill-current animate-pulse" />
            <span className="text-2xl font-extrabold italic tracking-tight uppercase drop-shadow-sm">
              Flash Sale
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-white ml-2">
            <span className="bg-blue-600 text-white px-2.5 py-1 rounded-sm text-sm shadow-sm">{formatTime(timeLeft.hours)}</span>
            <span className="text-blue-600 font-extrabold">:</span>
            <span className="bg-blue-600 text-white px-2.5 py-1 rounded-sm text-sm shadow-sm">{formatTime(timeLeft.minutes)}</span>
            <span className="text-blue-600 font-extrabold">:</span>
            <span className="bg-blue-600 text-white px-2.5 py-1 rounded-sm text-sm shadow-sm">{formatTime(timeLeft.seconds)}</span>
          </div>
        </div>
        <Link to="/flash-sale" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
          Xem tất cả <span className="text-lg leading-none">&rsaquo;</span>
        </Link>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-sm"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          // HIỂN THỊ KHI DATABASE TRỐNG HOẶC ĐÃ XÓA HẾT SẢN PHẨM
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <FiZap size={40} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium">Chương trình Flash Sale đang chuẩn bị quay lại!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {/* Dùng .slice(0, 6) để chỉ lấy tối đa 6 sản phẩm đầu tiên, không phá vỡ UI */}
            {products.slice(0, 6).map((product) => {
              const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : Math.floor(Math.random() * 40) + 10;
              const soldPercent = Math.floor(Math.random() * 80) + 10;

              return (
                <Link key={product._id} to={`/product/${product._id}`} className="block relative group hover:-translate-y-1 transition-transform bg-white p-2 border border-transparent hover:border-blue-100 rounded-lg hover:shadow-lg">
                  <div className="relative pt-[100%] bg-gray-50 mb-3 rounded-md overflow-hidden">
                    <img 
                      src={product.image || product.images?.[0] || 'https://via.placeholder.com/200'} // Phòng hờ lỗi ảnh
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-300 to-yellow-500 text-blue-900 font-bold text-xs px-1.5 py-0.5 z-10 flex flex-col items-center rounded-bl-lg shadow-sm">
                      <span className="text-[9px] uppercase">Giảm</span>
                      <span className="text-sm">{discount}%</span>
                    </div>
                  </div>
                  
                  <div className="text-center px-1">
                    <div className="text-blue-600 font-extrabold text-lg mb-2.5 line-clamp-1">
                      <span className="text-xs mr-0.5 underline">đ</span>
                      {new Intl.NumberFormat('vi-VN').format(product.price)}
                    </div>
                    
                    <div className="relative w-full h-4 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center border border-blue-200">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 z-0 transition-all duration-1000 ease-out" 
                        style={{ width: `${soldPercent}%` }}
                      ></div>
                      <span className="relative z-10 text-[9px] text-white font-bold tracking-wider uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                        {soldPercent > 80 ? "Sắp cháy hàng" : "Đang bán chạy"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSale;