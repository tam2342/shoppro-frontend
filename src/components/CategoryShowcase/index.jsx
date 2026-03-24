import { Link } from 'react-router-dom';

const CategoryShowcase = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Khám phá danh mục</h2>
          <p className="text-gray-500 mt-2">Tìm kiếm sản phẩm theo nhu cầu của bạn</p>
        </div>
        <Link to="/categories" className="hidden sm:block text-blue-600 font-medium hover:text-blue-800 hover:underline transition">
          Xem tất cả &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        {/* Box lớn */}
        <Link to="/category/laptop" className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop" alt="Laptop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8">
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">Xu hướng</span>
            <h3 className="text-3xl font-bold text-white mb-2">Laptop & MacBook</h3>
            <p className="text-gray-200">Hiệu năng vượt trội cho công việc và giải trí</p>
          </div>
        </Link>

        {/* Box nhỏ 1 */}
        <Link to="/category/smartphone" className="relative rounded-3xl overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600&auto=format&fit=crop" alt="Smartphone" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-xl font-bold text-white">Điện thoại di động</h3>
          </div>
        </Link>

        {/* Box nhỏ 2 */}
        <Link to="/category/audio" className="relative rounded-3xl overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop" alt="Audio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-xl font-bold text-white">Tai nghe & Loa</h3>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CategoryShowcase;