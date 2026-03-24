import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Kỹ thuật Debounce: Chờ người dùng ngừng gõ 300ms mới gọi API
  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const { data } = await axios.get(`https://shoppro-backend-k01l.onrender.com/api/products/search?keyword=${keyword}`);
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  // Click ra ngoài thì đóng khung kết quả lại
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectProduct = (productId) => {
    setIsOpen(false);
    setKeyword(''); // Xóa từ khóa sau khi chọn
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl z-50" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => keyword.trim() && setIsOpen(true)}
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full pl-5 pr-12 py-2.5 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        />
        <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 transition-colors">
          <FiSearch size={20} />
        </button>
      </form>

      {/* Khung thả xuống hiển thị kết quả */}
      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
          {results.map((product) => {
            
            // 👉 XỬ LÝ ẢNH AN TOÀN TẠI ĐÂY:
            let imageUrl = 'https://via.placeholder.com/150'; // Ảnh mặc định nếu lỗi
            
            // Nếu có mảng images thì lấy tấm đầu tiên
            if (product.images && product.images.length > 0) {
              imageUrl = product.images[0];
            } 
            // Đề phòng db cũ lưu tên là image
            else if (product.image) {
              imageUrl = product.image;
            }

            // Nếu là link tương đối (ví dụ /uploads/...) thì nối thêm domain backend
            if (imageUrl.startsWith('/')) {
              imageUrl = `https://shoppro-backend-k01l.onrender.com${imageUrl}`;
            }

            return (
              <div
                key={product._id}
                onClick={() => handleSelectProduct(product._id)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
              >
                <img 
                  src={imageUrl} 
                  alt={product.name} 
                  className="w-12 h-12 object-cover rounded-md border border-gray-100 mix-blend-multiply"
                />
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                  <p className="text-sm font-semibold text-blue-600 mt-0.5">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isOpen && keyword.trim() && results.length === 0 && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-center text-sm text-gray-500 animate-fade-in-up">
          Không tìm thấy sản phẩm nào phù hợp.
        </div>
      )}
    </div>
  );
};

export default SearchBar;