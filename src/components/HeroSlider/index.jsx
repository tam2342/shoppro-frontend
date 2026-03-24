import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const HeroSlider = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white overflow-hidden rounded-b-[3rem] shadow-2xl mb-12">
      {/* Background Decor: Abstract fluid shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col lg:flex-row items-center z-10">
        <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500 bg-opacity-30 border border-blue-400 text-blue-100 text-sm font-semibold tracking-wider mb-6 uppercase">
            Sự kiện ra mắt 2026
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Công nghệ đỉnh cao.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-100">
              Trải nghiệm mượt mà.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
            Khám phá hệ sinh thái thiết bị thông minh thế hệ mới. Thiết kế tinh tế, hiệu năng vượt trội, kết nối không giới hạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/products" 
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-700 font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center group"
            >
              Mua sắm ngay
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        
        <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* Vòng sáng phía sau ảnh */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop" 
              alt="Latest Technology" 
              className="relative z-10 w-full h-full object-cover rounded-3xl shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-700"
            />
          </div>
        </div>
      </div>

      {/* SVG Shape Divider (Hiệu ứng chảy/chất lỏng ở viền dưới) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.9,122.9,194.2,111.41C238.15,103.48,279.7,85.6,321.39,56.44Z" className="fill-gray-50"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSlider;