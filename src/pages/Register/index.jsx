import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  
  // 1. Thêm trường 'role' vào State với mặc định là 'buyer'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' 
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp!');
    }

    try {
      setIsLoading(true);
      
      // 2. Gửi linh động formData.role thay vì hardcode
      await axios.post('https://shoppro-backend-k01l.onrender.com/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role 
      });

      alert('🎉 Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');

    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi kết nối tới Server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Tạo tài khoản mới
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hoặc <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">đăng nhập nếu đã có tài khoản</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* KHU VỰC CHỌN VAI TRÒ (UI MỚI) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bạn muốn tham gia với tư cách?</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex flex-col items-center p-4 border-2 cursor-pointer rounded-xl transition-all ${formData.role === 'buyer' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="role" value="buyer" checked={formData.role === 'buyer'} onChange={handleChange} className="sr-only" />
                  <span className={`font-bold ${formData.role === 'buyer' ? 'text-blue-700' : 'text-gray-700'}`}>Người mua</span>
                </label>
                
                <label className={`relative flex flex-col items-center p-4 border-2 cursor-pointer rounded-xl transition-all ${formData.role === 'seller' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="role" value="seller" checked={formData.role === 'seller'} onChange={handleChange} className="sr-only" />
                  <span className={`font-bold ${formData.role === 'seller' ? 'text-blue-700' : 'text-gray-700'}`}>Người bán</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <div className="mt-1">
                <input name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ví dụ: Nguyễn Văn B" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
              <div className="mt-1">
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="email@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="mt-1">
                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Xác nhận Mật khẩu</label>
              <div className="mt-1">
                <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;