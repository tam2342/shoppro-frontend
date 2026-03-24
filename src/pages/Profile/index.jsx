import { useState } from 'react';
import { FiUser, FiPackage, FiMapPin, FiHeart, FiSettings, FiLogOut, FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore'; // Import store

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 1. Lấy dữ liệu user và hàm logout từ Store
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: <FiUser size={20} /> },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: <FiPackage size={20} /> },
    { id: 'address', label: 'Sổ địa chỉ', icon: <FiMapPin size={20} /> },
    { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: <FiHeart size={20} /> },
    { id: 'settings', label: 'Cài đặt tài khoản', icon: <FiSettings size={20} /> },
  ];

  // Nếu chưa đăng nhập thì không cho xem profile (Bảo mật cơ bản)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Tài khoản của tôi</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              {/* User Avatar Info - ĐÃ NỐI DỮ LIỆU THẬT */}
              <div className="p-6 border-b border-gray-100 flex items-center space-x-4 bg-gray-50">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md uppercase">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">
                    {user.role === 'seller' ? 'Chủ cửa hàng' : 'Thành viên Bạc'}
                  </p>
                </div>
              </div>
              
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                      activeTab === item.id 
                        ? 'bg-blue-50 text-blue-600 font-bold' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                    }`}
                  >
                    <span className={activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left text-red-600 hover:bg-red-50 font-medium"
                  >
                    <FiLogOut size={20} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium mb-1">Tổng đơn hàng</div>
                    <div className="text-3xl font-bold text-gray-900">0</div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium mb-1">Vai trò</div>
                    <div className="text-xl font-bold text-blue-600 uppercase">
                      {user.role === 'seller' ? 'Người bán' : 'Người mua'}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-gray-500 text-sm font-medium mb-1">Ngày tham gia</div>
                    <div className="text-lg font-bold text-gray-900">
                      {new Date().toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>

                {/* Thông tin cá nhân thực tế */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Thông tin cá nhân</h2>
                    <button className="text-sm font-medium text-blue-600 flex items-center hover:underline">
                      <FiEdit2 className="mr-1" /> Chỉnh sửa
                    </button>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Họ và tên</p>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                      <p className="font-semibold text-gray-900">{user.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Mật khẩu</p>
                      <p className="font-semibold text-gray-900">••••••••</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'dashboard' && (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[400px]">
                <FiPackage size={48} className="text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Đang phát triển</h2>
                <p className="text-gray-500">Khu vực {menuItems.find(i => i.id === activeTab)?.label} sẽ sớm được cập nhật dữ liệu từ API.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;