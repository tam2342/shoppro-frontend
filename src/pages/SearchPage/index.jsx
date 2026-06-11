// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiFilter, FiChevronLeft, FiChevronRight, FiInfo, FiShoppingCart, FiPlay } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';

const offerTypes = ['Đang giảm giá', 'Hàng có sẵn', 'Khuyến mãi'];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const keywordParam = searchParams.get('keyword');

  // STATES QUẢN LÝ DỮ LIỆU TỪ API
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [dynamicBrands, setDynamicBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATES QUẢN LÝ BỘ LỌC
  const [activeSort, setActiveSort] = useState('relevance');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]); 
  const [priceInput, setPriceInput] = useState({ min: '', max: '' });
  const [appliedPrice, setAppliedPrice] = useState({ min: '', max: '' });

  // ==========================================
  // LẤY DỮ LIỆU THẬT TỪ BACKEND
  // ==========================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Gọi API lấy toàn bộ sản phẩm (Nhớ đổi thành URL Render nếu đưa lên online)
        const { data } = await axios.get('https://shoppro-backend-k01l.onrender.com/api/products');
        
        // Đồng bộ cấu trúc dữ liệu từ DB cho khớp với Giao diện hiện tại
        const formattedData = data.map(p => ({
          ...p,
          id: p._id, // Giao diện đang dùng product.id, DB trả về _id
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/400',
          // Giả lập số bán và nơi bán để Giao diện luôn đẹp (vì DB chưa có cột này)
          sales: p.sales || Math.floor(Math.random() * 300) + 10,
          location: Math.random() > 0.3 ? 'Trong nước' : 'Nước ngoài',
          rating: p.rating || 5.0
        }));

        setAllProducts(formattedData);

        // Tự động trích xuất danh sách Thương hiệu từ dữ liệu thật
        const uniqueBrands = [...new Set(formattedData.map(item => item.brand).filter(Boolean))];
        setDynamicBrands(uniqueBrands);

      } catch (error) {
        console.error("Lỗi lấy sản phẩm thật:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ==========================================
  // LOGIC LỌC DỮ LIỆU
  // ==========================================
  useEffect(() => {
    // Luôn bắt đầu lọc từ mảng gốc (allProducts)
    let result = [...allProducts];

    // Lọc theo từ khóa
    if (keywordParam) {
      const lowerKeyword = keywordParam.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerKeyword));
    }

    // Lọc theo danh mục từ URL
    if (categoryParam) {
      result = result.filter(p => p.category === categoryParam);
    }

    // Lọc theo thương hiệu
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    // Lọc theo nơi bán
    if (selectedLocations.length > 0) {
      result = result.filter(p => selectedLocations.includes(p.location));
    }

    // Lọc theo tình trạng & ưu đãi
    if (selectedOffers.includes('Đang giảm giá')) {
      result = result.filter(p => p.oldPrice && p.oldPrice > p.price);
    }
    if (selectedOffers.includes('Hàng có sẵn')) {
      result = result.filter(p => p.countInStock > 0);
    }
    if (selectedOffers.includes('Khuyến mãi')) {
      result = result.filter(p => p.isPromo);
    }

    // Lọc theo khoảng giá
    if (appliedPrice.min !== '') {
      result = result.filter(p => p.price >= Number(appliedPrice.min));
    }
    if (appliedPrice.max !== '') {
      result = result.filter(p => p.price <= Number(appliedPrice.max));
    }

    // Sắp xếp
    switch (activeSort) {
      case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break; // Lấy theo ngày tạo thật
      case 'top_sales': result.sort((a, b) => b.sales - a.sales); break;
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      default: break;
    }

    setFilteredProducts(result);
  }, [allProducts, activeSort, selectedBrands, selectedLocations, selectedOffers, appliedPrice, keywordParam, categoryParam]);

  const toggleFilter = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter(item => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const handleApplyPrice = () => {
    setAppliedPrice({ min: priceInput.min, max: priceInput.max });
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedLocations([]);
    setSelectedOffers([]);
    setPriceInput({ min: '', max: '' });
    setAppliedPrice({ min: '', max: '' });
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-6">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-0">
        
        {/* TIÊU ĐỀ KẾT QUẢ TÌM KIẾM */}
        <div className="flex items-center gap-2 mb-6 text-gray-700 bg-white p-4 rounded-sm shadow-sm">
          <FiInfo size={22} className="text-blue-600"/>
          {keywordParam ? (
            <>
              <span className="text-base">Kết quả tìm kiếm cho từ khoá </span>
              <span className="text-blue-600 font-bold text-lg">'{keywordParam}'</span>
            </>
          ) : categoryParam ? (
            <>
              <span className="text-base">Sản phẩm thuộc danh mục </span>
              <span className="text-blue-600 font-bold text-lg">'{categoryParam}'</span>
            </>
          ) : (
            <span className="text-base font-medium">Tất cả sản phẩm</span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {/* CỘT TRÁI: BỘ LỌC */}
          <div className="w-full md:w-[220px] shrink-0 bg-white p-4 rounded-sm shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center gap-2 font-bold text-gray-800 uppercase mb-4">
              <FiFilter size={16} /> BỘ LỌC TÌM KIẾM
            </div>

            {/* Lọc Nơi Bán */}
            <div className="py-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3 text-sm">Nơi Bán</h3>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
                    checked={selectedLocations.includes('Trong nước')}
                    onChange={() => toggleFilter('Trong nước', selectedLocations, setSelectedLocations)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600">Trong nước</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
                    checked={selectedLocations.includes('Nước ngoài')}
                    onChange={() => toggleFilter('Nước ngoài', selectedLocations, setSelectedLocations)}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600">Nước ngoài</span>
                </label>
              </div>
            </div>

            {/* Tình Trạng & Ưu Đãi */}
            <div className="py-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3 text-sm">Tình Trạng & Ưu Đãi</h3>
              <div className="space-y-2.5">
                {offerTypes.map((offer, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
                      checked={selectedOffers.includes(offer)}
                      onChange={() => toggleFilter(offer, selectedOffers, setSelectedOffers)}
                    />
                    <span className="text-sm text-gray-700 group-hover:text-blue-600">{offer}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Khoảng Giá */}
            <div className="py-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3 text-sm">Khoảng Giá (VNĐ)</h3>
              <div className="flex items-center gap-2 mb-3">
                <input 
                  type="number" 
                  placeholder="TỪ" 
                  value={priceInput.min}
                  onChange={(e) => setPriceInput({...priceInput, min: e.target.value})}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-sm text-sm outline-none focus:border-blue-500"
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="ĐẾN" 
                  value={priceInput.max}
                  onChange={(e) => setPriceInput({...priceInput, max: e.target.value})}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-sm text-sm outline-none focus:border-blue-500"
                />
              </div>
              <button 
                onClick={handleApplyPrice}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 rounded-sm text-sm transition-colors flex items-center justify-center gap-1"
              >
                ÁP DỤNG <FiPlay fill="currentColor" size={10} className="mt-0.5"/>
              </button>
            </div>

            {/* Lọc Thương Hiệu (Load Động) */}
            {dynamicBrands.length > 0 && (
              <div className="py-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-800 mb-3 text-sm">Thương Hiệu</h3>
                <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {dynamicBrands.map((brand, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)}
                      />
                      <span className="text-sm text-gray-700 group-hover:text-blue-600 uppercase">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Nút Xóa Bộ Lọc */}
            {(selectedBrands.length > 0 || selectedLocations.length > 0 || selectedOffers.length > 0 || appliedPrice.min || appliedPrice.max) && (
              <button 
                onClick={clearAllFilters}
                className="w-full mt-4 bg-gray-100 text-gray-700 border border-gray-200 py-2 rounded-sm text-sm font-medium hover:bg-gray-200 uppercase transition-colors"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {/* CỘT PHẢI: SORT BAR & KẾT QUẢ */}
          <div className="flex-1">
            <div className="bg-white p-3 rounded-sm shadow-sm flex items-center justify-between mb-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 mr-2 hidden sm:block">Sắp xếp theo</span>
                <button onClick={() => setActiveSort('relevance')} className={`px-4 py-2 text-sm rounded-sm transition-colors ${activeSort === 'relevance' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>Liên Quan</button>
                <button onClick={() => setActiveSort('newest')} className={`px-4 py-2 text-sm rounded-sm transition-colors ${activeSort === 'newest' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>Mới Nhất</button>
                <button onClick={() => setActiveSort('top_sales')} className={`px-4 py-2 text-sm rounded-sm transition-colors ${activeSort === 'top_sales' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>Bán Chạy</button>
                <select 
                  className={`px-4 py-2 text-sm rounded-sm outline-none cursor-pointer border-none shadow-sm ${['price_asc', 'price_desc'].includes(activeSort) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                  value={['price_asc', 'price_desc'].includes(activeSort) ? activeSort : ''}
                  onChange={(e) => setActiveSort(e.target.value)}
                >
                  <option value="" disabled hidden>Giá</option>
                  <option value="price_asc" className="text-gray-800 bg-white">Giá: Thấp đến Cao</option>
                  <option value="price_desc" className="text-gray-800 bg-white">Giá: Cao đến Thấp</option>
                </select>
              </div>

              <div className="hidden lg:flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-blue-600 font-medium">{filteredProducts.length > 0 ? '1' : '0'}</span>
                  /{Math.ceil(filteredProducts.length / 20) || 1}
                </div>
                <div className="flex shadow-sm rounded-sm overflow-hidden">
                  <button className="w-9 h-9 bg-gray-50 border-r border-gray-200 flex items-center justify-center text-gray-400 cursor-not-allowed"><FiChevronLeft size={18} /></button>
                  <button className="w-9 h-9 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 cursor-not-allowed"><FiChevronRight size={18} /></button>
                </div>
              </div>
            </div>

            {/* TRẠNG THÁI LOADING */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-md h-72 animate-pulse border border-gray-100"></div>
                ))}
              </div>
            ) : (
              /* LƯỚI SẢN PHẨM SỬ DỤNG GIAO DIỆN PREMIUM */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-md overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 border border-gray-100 group flex flex-col">
                      <div className="relative w-full pt-[100%] bg-gray-50 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {product.oldPrice && (
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xs px-2 py-1 rounded-full shadow-md z-10">
                            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                          </div>
                        )}
                        
                        {/* Badge Hết Hàng */}
                        {product.countInStock === 0 && (
                          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                            <span className="bg-black/70 text-white font-semibold text-xs px-3 py-1.5 rounded-sm uppercase tracking-wide">Hết hàng</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-2">
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg font-medium text-xs flex items-center justify-center gap-1.5 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <FiShoppingCart /> Mua ngay
                          </button>
                        </div>
                      </div>
                      
                      <div className="p-3 flex-1 flex flex-col justify-between bg-white z-20">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
                            <span className="inline-block bg-[#f3f0df] text-blue-900 text-[9px] px-1 py-0.5 mr-1.5 rounded-sm uppercase font-bold tracking-wider relative -top-0.5">
                              Mall
                            </span>
                            {product.name}
                          </h3>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center text-blue-600 mb-1">
                            <span className="text-xs font-semibold underline decoration-1 underline-offset-2">đ</span>
                            <span className="text-base font-bold ml-0.5">
                              {new Intl.NumberFormat('vi-VN').format(product.price)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-50">
                            <div className="flex items-center text-yellow-400">
                              <AiFillStar size={11} />
                              <span className="ml-0.5 text-[10px] text-gray-500 font-medium">{product.rating}</span>
                            </div>
                            <div className="text-[10px] text-gray-500 font-medium">
                              Đã bán {product.sales}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-sm shadow-sm border border-gray-100">
                    <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/search/a60759ad1dabe909c46a817ecbf71878.png" alt="No results" className="w-32 h-32 mb-4 opacity-50" />
                    <p className="text-lg font-medium">Không tìm thấy kết quả nào</p>
                    <p className="text-sm mt-1">Hãy thử sử dụng các bộ lọc khác hoặc mở rộng khoảng giá</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;