import { useState, useEffect } from 'react';
import { FiUser, FiPackage, FiMapPin, FiHeart, FiSettings, FiLogOut, FiEdit2, FiPlus, FiTrash2, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Select from 'react-select';
import axios from 'axios';
import UserOrderList from '../../components/UserOrderList';
import UserWishlist from '../../components/UserWishlist';

const VIETNAM_PROVINCES = [
  { value: 'Hà Nội', label: 'Hà Nội' }, { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' }, { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Cần Thơ', label: 'Cần Thơ' }, { value: 'An Giang', label: 'An Giang' },
  { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' }, { value: 'Bắc Giang', label: 'Bắc Giang' },
  { value: 'Bắc Kạn', label: 'Bắc Kạn' }, { value: 'Bạc Liêu', label: 'Bạc Liêu' },
  { value: 'Bắc Ninh', label: 'Bắc Ninh' }, { value: 'Bến Tre', label: 'Bến Tre' },
  { value: 'Bình Định', label: 'Bình Định' }, { value: 'Bình Dương', label: 'Bình Dương' },
  { value: 'Bình Phước', label: 'Bình Phước' }, { value: 'Bình Thuận', label: 'Bình Thuận' },
  { value: 'Cà Mau', label: 'Cà Mau' }, { value: 'Cao Bằng', label: 'Cao Bằng' },
  { value: 'Đắk Lắk', label: 'Đắk Lắk' }, { value: 'Đắk Nông', label: 'Đắk Nông' },
  { value: 'Điện Biên', label: 'Điện Biên' }, { value: 'Đồng Nai', label: 'Đồng Nai' },
  { value: 'Đồng Tháp', label: 'Đồng Tháp' }, { value: 'Gia Lai', label: 'Gia Lai' },
  { value: 'Hà Giang', label: 'Hà Giang' }, { value: 'Hà Nam', label: 'Hà Nam' },
  { value: 'Hà Tĩnh', label: 'Hà Tĩnh' }, { value: 'Hải Dương', label: 'Hải Dương' },
  { value: 'Hậu Giang', label: 'Hậu Giang' }, { value: 'Hòa Bình', label: 'Hòa Bình' },
  { value: 'Hưng Yên', label: 'Hưng Yên' }, { value: 'Khánh Hòa', label: 'Khánh Hòa' },
  { value: 'Kiên Giang', label: 'Kiên Giang' }, { value: 'Kon Tum', label: 'Kon Tum' },
  { value: 'Lai Châu', label: 'Lai Châu' }, { value: 'Lâm Đồng', label: 'Lâm Đồng' },
  { value: 'Lạng Sơn', label: 'Lạng Sơn' }, { value: 'Lào Cai', label: 'Lào Cai' },
  { value: 'Long An', label: 'Long An' }, { value: 'Nam Định', label: 'Nam Định' },
  { value: 'Nghệ An', label: 'Nghệ An' }, { value: 'Ninh Bình', label: 'Ninh Bình' },
  { value: 'Ninh Thuận', label: 'Ninh Thuận' }, { value: 'Phú Thọ', label: 'Phú Thọ' },
  { value: 'Quảng Bình', label: 'Quảng Bình' }, { value: 'Quảng Nam', label: 'Quảng Nam' },
  { value: 'Quảng Ngãi', label: 'Quảng Ngãi' }, { value: 'Quảng Ninh', label: 'Quảng Ninh' },
  { value: 'Quảng Trị', label: 'Quảng Trị' }, { value: 'Sóc Trăng', label: 'Sóc Trăng' },
  { value: 'Sơn La', label: 'Sơn La' }, { value: 'Tây Ninh', label: 'Tây Ninh' },
  { value: 'Thái Bình', label: 'Thái Bình' }, { value: 'Thái Nguyên', label: 'Thái Nguyên' },
  { value: 'Thanh Hóa', label: 'Thanh Hóa' }, { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
  { value: 'Tiền Giang', label: 'Tiền Giang' }, { value: 'Trà Vinh', label: 'Trà Vinh' },
  { value: 'Tuyên Quang', label: 'Tuyên Quang' }, { value: 'Vĩnh Long', label: 'Vĩnh Long' },
  { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' }, { value: 'Yên Bái', label: 'Yên Bái' },
  { value: 'Phú Yên', label: 'Phú Yên' }
];

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { user, logout } = useAuthStore();

  // State cho sổ địa chỉ
  const [addresses, setAddresses] = useState([]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    detail: '',
    city: null
  });

  // State cho đổi mật khẩu
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // ==================== THÊM STATE CHO 2FA ====================
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.is2FAEnabled || false);

  // Load địa chỉ từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userAddresses');
    if (saved) {
      setAddresses(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
  }, [addresses]);

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
    if (!newAddress.name || !newAddress.phone || !newAddress.detail || !newAddress.city) {
      alert("Vui lòng điền đầy đủ thông tin địa chỉ!");
      return;
    }

    const addressToAdd = {
      id: Date.now(),
      name: newAddress.name,
      phone: newAddress.phone,
      detail: newAddress.detail,
      city: newAddress.city.value || newAddress.city
    };

    setAddresses([...addresses, addressToAdd]);
    setNewAddress({ name: '', phone: '', detail: '', city: null });
    setShowAddAddress(false);
    alert("Đã thêm địa chỉ mới thành công!");
  };

  const deleteAddress = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
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

    alert("✅ Đổi mật khẩu thành công! (Chưa kết nối API)");
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
  };

  // ==================== XỬ LÝ 2FA (BỔ SUNG) ====================
  const handleToggle2FA = async () => {
  try {
    const config = { 
      headers: { 
        Authorization: `Bearer ${user.token}` 
      } 
    };

    console.log("Đang gọi API toggle 2FA..."); // Debug

    const { data } = await axios.put(
      'https://shoppro-backend-k01l.onrender.com/api/auth/toggle-2fa', 
      {}, 
      config
    );

    setIs2FAEnabled(data.is2FAEnabled);
    alert(data.message || 'Cập nhật 2FA thành công');
    
  } catch (error) {
    console.error("LỖI TOGGLE 2FA:", error.response?.data || error.message);
    
    const errorMsg = error.response?.data?.message || 
                    error.message || 
                    'Không thể thay đổi cài đặt 2FA. Vui lòng thử lại.';
    
    alert('❌ ' + errorMsg);
  }
};

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Tài khoản của tôi</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
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
            {/* TAB: TỔNG QUAN */}
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

            {/* TAB: ĐƠN HÀNG */}
            {activeTab === 'orders' && <UserOrderList />}

            {/* TAB: SẢN PHẨM YÊU THÍCH */}
            {activeTab === 'wishlist' && <UserWishlist />}

            {/* TAB: SỔ ĐỊA CHỈ */}
            {activeTab === 'address' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Sổ địa chỉ ({addresses.length})</h2>
                  <button 
                    onClick={() => setShowAddAddress(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition"
                  >
                    <FiPlus size={18} /> Thêm địa chỉ mới
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <FiMapPin size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Bạn chưa có địa chỉ nào</p>
                    <p className="text-sm mt-1">Hãy thêm địa chỉ giao hàng để thanh toán nhanh hơn</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="border rounded-2xl p-6 hover:border-gray-400 transition-all">
                        <div className="flex justify-between">
                          <div className="space-y-1.5">
                            <p className="font-semibold text-lg">{addr.name}</p>
                            <p className="text-gray-600">{addr.phone}</p>
                            <p className="text-gray-600">{addr.detail}</p>
                            <p className="text-gray-600">{addr.city}</p>
                          </div>
                          <button 
                            onClick={() => deleteAddress(addr.id)}
                            className="text-red-500 hover:text-red-700 self-start"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showAddAddress && (
                  <div className="mt-10 border-t pt-8">
                    <h3 className="font-bold text-lg mb-6">Thêm địa chỉ mới</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Nhập họ và tên" 
                          className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                        <input 
                          type="tel" 
                          placeholder="Nhập số điện thoại" 
                          className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ cụ thể <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Số nhà, tên đường, phường/xã..." 
                          className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                          value={newAddress.detail}
                          onChange={(e) => setNewAddress({...newAddress, detail: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Thành phố / Tỉnh <span className="text-red-500">*</span></label>
                        <Select
                          options={VIETNAM_PROVINCES}
                          value={newAddress.city}
                          onChange={(selected) => setNewAddress({...newAddress, city: selected})}
                          placeholder="Chọn Tỉnh/Thành phố..."
                          isSearchable={true}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button 
                        onClick={addNewAddress}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700"
                      >
                        Lưu địa chỉ
                      </button>
                      <button 
                        onClick={() => {
                          setShowAddAddress(false);
                          setNewAddress({ name: '', phone: '', detail: '', city: null });
                        }}
                        className="bg-gray-200 px-8 py-3 rounded-xl font-medium hover:bg-gray-300"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== CÀI ĐẶT TÀI KHOẢN (ĐÃ BỔ SUNG 2FA) ==================== */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                <h2 className="text-xl font-bold">Cài đặt tài khoản</h2>

                {/* Mục 2FA */}
                <div className="border rounded-2xl p-6 bg-gray-50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FiShield className="text-blue-600" size={20} /> Xác thực 2 lớp (2FA) bằng Email
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Bảo vệ tài khoản bằng cách yêu cầu mã OTP gửi về email mỗi khi bạn đăng nhập lại.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={is2FAEnabled}
                      onChange={handleToggle2FA}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Đổi mật khẩu */}
                <div className="border rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Đổi mật khẩu</h3>
                  <button 
                    onClick={() => setShowChangePassword(!showChangePassword)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {showChangePassword ? 'Hủy đổi mật khẩu' : 'Thay đổi mật khẩu tài khoản'}
                  </button>

                  {showChangePassword && (
                    <div className="mt-6 space-y-4 max-w-md animate-fade-in">
                      <input 
                        type="password" placeholder="Mật khẩu hiện tại" 
                        className="w-full p-3.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                      <input 
                        type="password" placeholder="Mật khẩu mới" 
                        className="w-full p-3.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                      <input 
                        type="password" placeholder="Nhập lại mật khẩu mới" 
                        className="w-full p-3.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                      <button 
                        onClick={handleChangePassword}
                        className="bg-blue-600 text-white px-8 py-3.5 rounded-xl mt-2 hover:bg-blue-700 w-full font-semibold transition"
                      >
                        Xác nhận đổi mật khẩu
                      </button>
                    </div>
                  )}
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