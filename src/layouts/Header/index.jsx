import { Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiUser, FiPackage, FiMessageSquare } from 'react-icons/fi';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import SearchBar from '../../components/SearchBar';

const Header = () => {
  const { user, isAuthenticated } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const cartItemCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
          ShopPro<span className="text-gray-800">.</span>
        </Link>

        {/* Thanh tìm kiếm */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <SearchBar />
          <button className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500">
            <FiSearch size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-6">
          {/* NÚT "KÊNH NGƯỜI BÁN" & "TIN NHẮN" - CHỈ HIỆN KHI ROLE LÀ SELLER */}
          {isAuthenticated && user?.role === 'seller' && (
            <div className="flex items-center gap-3 border-r border-gray-200 pr-6 mr-2">
              <Link 
                to="/seller/products" 
                className="hidden md:flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-bold text-sm hover:bg-blue-100 transition-all border border-blue-100"
              >
                <FiPackage />
                <span>Kênh Người Bán</span>
              </Link>
              
              {/* Nút Tin nhắn */}
              <Link 
                to="/seller/messages" 
                className="relative text-gray-600 hover:text-blue-600 transition p-2 bg-gray-50 rounded-full hover:bg-blue-50"
                title="Trung tâm tin nhắn"
              >
                <FiMessageSquare size={22} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </Link>
            </div>
          )}

          {/* Icon Giỏ hàng */}
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition">
            <FiShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {/* Avatar & Tên */}
          {isAuthenticated ? (
            <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition group">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-blue-700 transition-colors uppercase">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <span className="hidden sm:block text-sm font-semibold uppercase">{user?.name}</span>
            </Link>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">
              <FiUser size={24} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;