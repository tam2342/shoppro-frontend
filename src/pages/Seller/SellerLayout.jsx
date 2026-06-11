import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
// 👉 ĐÃ FIX: Thêm FiPieChart cho phần thống kê
import { FiPieChart, FiPackage, FiShoppingCart, FiMessageSquare, FiLogOut, FiMenu, FiX, FiBell, FiUser } from 'react-icons/fi';

const SellerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Lấy thông tin user đang đăng nhập
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || { name: 'Seller' };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.removeItem('userInfo');
      navigate('/login');
    }
  };

  // 👉 ĐÃ FIX: Thêm object thống kê vào danh sách menu
  const menuItems = [
    { path: '/seller/dashboard', name: 'Thống kê & Doanh thu', icon: <FiPieChart size={20} /> },
    { path: '/seller/orders', name: 'Quản lý Đơn hàng', icon: <FiShoppingCart size={20} /> },
    { path: '/seller/products', name: 'Quản lý Sản phẩm', icon: <FiPackage size={20} /> },
    { path: '/seller/messages', name: 'Tin nhắn & CSKH', icon: <FiMessageSquare size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#f5f7fa] overflow-hidden">
      
      {/* 1. SIDEBAR (THANH ĐIỀU HƯỚNG BÊN TRÁI) */}
      <aside className={`fixed inset-y-0 left-0 bg-white shadow-xl w-64 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
          <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-wider">
            Shop<span className="text-yellow-500">Pro</span> <span className="text-sm font-medium text-gray-500 ml-1">Seller</span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-red-500">
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 mt-2">Danh mục quản lý</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`
              }
              onClick={() => setIsSidebarOpen(false)} 
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 absolute bottom-0 w-full bg-white">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 font-medium rounded-xl hover:bg-red-50 transition-colors"
          >
            <FiLogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* OVERLAY CHO MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Kênh Người Bán</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <FiBell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border border-blue-200 group-hover:shadow-md transition-all">
                <FiUser size={20} />
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-800">{userInfo.name}</p>
                <p className="text-xs text-gray-500 font-medium">Chủ gian hàng</p>
              </div>
            </div>
          </div>
        </header>

        {/* NỘI DUNG ĐỘNG */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f5f7fa] p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Outlet /> 
        </main>

      </div>
    </div>
  );
};

export default SellerLayout;