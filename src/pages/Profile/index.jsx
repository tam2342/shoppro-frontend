import { useState } from 'react';
import { FiUser, FiPackage, FiMapPin, FiHeart, FiSettings, FiLogOut, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import UserOrderList from '../../components/UserOrderList';
import UserWishlist from '../../components/UserWishlist';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { user, logout } = useAuthStore();

  // State cho sổ địa chỉ
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: user?.name || "Nguyễn Văn A",
      phone: "0123456789",
      address: "123 Đường ABC, Phường 1, Quận 1",
      city: "TP. Hồ Chí Minh",
      isDefault: true
    }
  ]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  // State cho đổi mật khẩu
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
      </div>
    );
  }

  // ==================== XỬ LÝ SỔ ĐỊA CHỈ ====================
  const addNewAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    const addressToAdd = {
      id: Date.now(),
      ...newAddress,
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, addressToAdd]);
    setNewAddress({ name: '', phone: '', address: '', city: '' });
    setShowAddAddress(false);
    alert("Đã thêm địa chỉ mới!");
  };

  const deleteAddress = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const setDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  // ==================== ĐỔI MẬT KHẨU ====================
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    // TODO: Gọi API đổi mật khẩu ở đây
    alert("✅ Đổi mật khẩu thành công! (Chưa kết nối API)");
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Tài khoản của tôi</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Menu */}
          <div className="w-full md:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 flex items-center space-x-4 bg-gray-50">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md uppercase">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">
                    {user.role === 'seller' ? 'Chủ cửa hàng' : 'Thành viên'}
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

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* ... giữ nguyên phần dashboard cũ ... */}
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
                  </div>
                </div>
              </div>
            )}

            {/* Đơn hàng */}
            {activeTab === 'orders' && <UserOrderList />}

            {/* Sản phẩm yêu thích */}
            {activeTab === 'wishlist' && <UserWishlist />}

            {/* ==================== SỔ ĐỊA CHỈ ==================== */}
            {activeTab === 'address' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Sổ địa chỉ</h2>
                  <button 
                    onClick={() => setShowAddAddress(true)}
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700"
                  >
                    <FiPlus /> Thêm địa chỉ mới
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border rounded-2xl p-5 hover:border-blue-300 transition-all">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{addr.name}</p>
                          <p className="text-gray-600">{addr.phone}</p>
                          <p className="text-gray-600 mt-1">{addr.address}</p>
                          <p className="text-gray-600">{addr.city}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {addr.isDefault && (
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full self-start">Mặc định</span>
                          )}
                          <button 
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Đặt làm mặc định
                          </button>
                          <button 
                            onClick={() => deleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form thêm địa chỉ mới */}
                {showAddAddress && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="font-bold mb-4">Thêm địa chỉ mới</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" placeholder="Họ tên" 
                        className="p-3 border rounded-xl" 
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="Số điện thoại" 
                        className="p-3 border rounded-xl" 
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="Địa chỉ chi tiết" 
                        className="p-3 border rounded-xl md:col-span-2" 
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                      />
                      <input 
                        type="text" placeholder="Tỉnh/Thành phố" 
                        className="p-3 border rounded-xl" 
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button 
                        onClick={addNewAddress}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
                      >
                        Lưu địa chỉ
                      </button>
                      <button 
                        onClick={() => setShowAddAddress(false)}
                        className="bg-gray-200 px-6 py-3 rounded-xl"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== CÀI ĐẶT TÀI KHOẢN ==================== */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold mb-6">Cài đặt tài khoản</h2>

                <div className="border rounded-2xl p-6 mb-8">
                  <h3 className="font-semibold mb-4">Đổi mật khẩu</h3>
                  <button 
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="text-blue-600 hover:underline"
                  >
                    {showChangePassword ? 'Đóng form' : 'Thay đổi mật khẩu'}
                  </button>

                  {showChangePassword && (
                    <div className="mt-6 space-y-4">
                      <input 
                        type="password" 
                        placeholder="Mật khẩu hiện tại" 
                        className="w-full p-3 border rounded-xl"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                      <input 
                        type="password" 
                        placeholder="Mật khẩu mới" 
                        className="w-full p-3 border rounded-xl"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                      <input 
                        type="password" 
                        placeholder="Nhập lại mật khẩu mới" 
                        className="w-full p-3 border rounded-xl"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                      <button 
                        onClick={handleChangePassword}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl mt-2"
                      >
                        Xác nhận đổi mật khẩu
                      </button>
                    </div>
                  )}
                </div>

                {/* Phần OTP sẽ thêm sau */}
                <div className="text-sm text-gray-500">
                  Tính năng xác thực OTP bằng email sẽ được bổ sung sau.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;