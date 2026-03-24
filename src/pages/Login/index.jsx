import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // 1. Khởi tạo State để quản lý dữ liệu form và trạng thái tải
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Hàm cập nhật dữ liệu khi người dùng gõ phím
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Hàm xử lý logic gọi API Đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn trang web bị reload
    setError('');
    setIsLoading(true);

    try {
      // Bắn dữ liệu lên Backend
      const response = await axios.post('https://shoppro-backend-k01l.onrender.com/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      // Nếu thành công, lưu thông tin User và Token vào Store
      login(response.data);

      // Chuyển thẳng về trang chủ
      navigate('/');
    } catch (err) {
      // Bắt lỗi từ Backend (Sai pass, không tìm thấy email...)
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi kết nối tới Server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Cột trái: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/" className="text-3xl font-extrabold text-blue-600 tracking-tight">
              ShopPro<span className="text-gray-900">.</span>
            </Link>
            <h2 className="mt-8 text-3xl font-extrabold text-gray-900">Đăng nhập</h2>
            <p className="mt-2 text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition">
                Đăng ký ngay
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Khu vực hiển thị thông báo lỗi từ Server */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Địa chỉ Email
                  </label>
                  <div className="mt-1 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border outline-none transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <div className="mt-1 relative rounded-xl shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-xl py-3 border outline-none transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 cursor-pointer">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition">
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                  >
                    {isLoading ? 'Đang kiểm tra...' : 'Đăng nhập'} <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <FcGoogle className="w-5 h-5 mr-2" />
                    Đăng nhập bằng Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Hình ảnh nghệ thuật */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gray-900">
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-overlay"
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000&auto=format&fit=crop"
          alt="E-commerce shopping background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent flex flex-col justify-end px-20 pb-20 text-white">
          <h2 className="text-4xl font-bold mb-4">Mua sắm thông minh.</h2>
          <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
            Gia nhập cộng đồng hàng triệu người dùng tại ShopPro để trải nghiệm dịch vụ mua sắm thiết bị công nghệ hàng đầu với những ưu đãi đặc quyền.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;