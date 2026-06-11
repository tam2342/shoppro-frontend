// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../../components/HeroSlider';
import TrustBadges from '../../components/TrustBadges';
import CategoryGrid from '../../components/CategoryGrid';
import FlashSale from '../../components/FlashSale';
import ShopMall from '../../components/ShopMall';
import ProductCard from '../../components/ProductCard';
import { FiChevronRight, FiChevronsRight, FiChevronLeft } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // QUẢN LÝ HIỂN THỊ VÀ PHÂN TRANG
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // 4 hàng x 6 cột = 24 sản phẩm/trang

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('https://shoppro-backend-k01l.onrender.com/api/products');
        
        const formattedData = data.map(p => ({
          ...p,
          image: p.images && p.images.length > 0 ? p.images[0] : p.image
        }));

        setProducts(formattedData);
        setFlashSaleProducts(formattedData.slice(0, 6));
      } catch (error) {
        console.error("Lỗi lấy sản phẩm thật:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // LOGIC TÍNH TOÁN SẢN PHẨM HIỂN THỊ
  const displayedProducts = isExpanded 
    ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : products.slice(0, 6);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  // HÀM XỬ LÝ CHUYỂN TRANG CÓ HIỆU ỨNG CUỘN
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const element = document.getElementById('suggested-products');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#f5f5f5] pb-12 min-h-screen">
      
      {/* TOP BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-900 text-white shadow-lg border-b border-blue-800/50">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px] animate-[slide_3s_linear_infinite]"></div>

        <div className="relative max-w-[1200px] mx-auto px-4 md:px-6 py-5 md:py-6 flex flex-col md:flex-row justify-between items-center gap-5 md:gap-6 z-10">
          <div className="flex items-center gap-4 md:gap-5 text-center md:text-left">
            <span className="p-3 bg-white/10 rounded-full text-yellow-300 hidden sm:flex items-center justify-center shadow-inner border border-white/10">
              <FaCrown size={28} className="rotate-[-15deg] drop-shadow-md"/>
            </span>
            <div>
              <h3 className="font-extrabold text-yellow-300 text-lg md:text-2xl uppercase tracking-wider mb-1 drop-shadow-md">
                ShopPro Premium Mall
              </h3>
              <p className="font-medium text-blue-100 text-sm md:text-base tracking-wide flex items-center justify-center md:justify-start gap-1.5">
                <span className="hidden sm:inline">Cam kết</span> Hàng chính hãng 100% 
                <span className="text-white/50 px-1">•</span> Miễn phí vận chuyển
              </p>
            </div>
          </div>

          <a
            href="#flash-sale"
            className="group flex items-center justify-center gap-3 px-8 py-3.5 bg-white text-blue-800 rounded-full font-extrabold text-base md:text-lg shadow-[0_4px_15px_rgba(255,255,255,0.2)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.4)] hover:bg-cyan-50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 whitespace-nowrap w-full md:w-auto"
          >
            Săn Ưu Đãi Ngay
            <div className="relative w-5 h-5 overflow-hidden flex items-center">
              <FiChevronRight size={20} className="absolute text-blue-600 transition-transform duration-300 group-hover:translate-x-full group-hover:opacity-0" />
              <FiChevronsRight size={22} className="absolute text-cyan-600 transition-transform duration-300 translate-x-[-100%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
            </div>
            <div className="absolute inset-0 rounded-full group-hover:animate-pulse group-hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all"></div>
          </a>
        </div>
      </div>

      <div className="bg-white">
        <HeroSlider />
        <TrustBadges />
      </div>

      {/* 👉 ĐÃ SỬA: Đổi max-w-[1200px] thành w-[95%] lg:w-[85%] để mở rộng giao diện 85% trên máy tính */}
      <div className="w-[95%] lg:w-[85%] mx-auto px-4 sm:px-0 mt-6 space-y-6">
        <CategoryGrid />
        
        {flashSaleProducts.length > 0 && (
          <div id="flash-sale">
            <FlashSale products={flashSaleProducts} loading={loading} />
          </div>
        )}

        <ShopMall />

        {/* ==========================================
            KHU VỰC GỢI Ý HÔM NAY
        ========================================== */}
        <div id="suggested-products" className="mt-8">
          <div className="bg-white border-b-2 border-blue-500 mb-4 flex justify-between items-center px-6 py-4 rounded-t-lg shadow-sm">
            <h2 className="text-xl font-bold text-blue-600 uppercase tracking-wide">
              Gợi Ý Hôm Nay
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 bg-white animate-pulse rounded-sm border border-gray-100"></div>
              ))}
            </div>
          ) : (
            <>
              {/* LƯỚI SẢN PHẨM */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-20 bg-white rounded-sm">
                    Chưa có sản phẩm nào.
                  </p>
                )}
              </div>
              
              {/* NÚT XEM THÊM */}
              {!isExpanded && products.length > 6 && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={() => setIsExpanded(true)}
                    className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 px-24 py-3 rounded-sm font-medium transition-colors shadow-sm"
                  >
                    Xem thêm
                  </button>
                </div>
              )}

              {/* THANH CHUYỂN TRANG */}
              {isExpanded && totalPages > 1 && (
                <div className="mt-10 flex justify-center items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 flex items-center justify-center rounded font-medium transition-all shadow-sm ${
                          currentPage === pageNum 
                            ? 'bg-blue-600 text-white border-blue-600 scale-110' 
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 text-gray-500 disabled:opacity-40 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;