// src/components/CategoryGrid.jsx
import { Link } from 'react-router-dom';
import { 
  FaMobileAlt, FaLaptop, FaTshirt, FaFemale, 
  FaBaby, FaHome, FaSpa, FaHeartbeat, 
  FaShoePrints, FaClock, FaBicycle, 
  FaMotorcycle, FaShoppingBasket, FaCrown 
} from 'react-icons/fa';

const categories = [
  { name: "Điện Thoại & Phụ Kiện", icon: <FaMobileAlt size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-blue-400 to-blue-600" },
  { name: "Máy Tính & Laptop", icon: <FaLaptop size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-indigo-400 to-indigo-600" },
  { name: "Thời Trang Nam", icon: <FaTshirt size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-cyan-400 to-cyan-600" },
  { name: "Thời Trang Nữ", icon: <FaFemale size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-pink-400 to-pink-600" },
  { name: "Mẹ & Bé", icon: <FaBaby size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-rose-400 to-rose-600" },
  { name: "Nhà Cửa & Đời Sống", icon: <FaHome size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-orange-400 to-orange-600" },
  { name: "Sắc Đẹp", icon: <FaSpa size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600" },
  { name: "Sức Khỏe", icon: <FaHeartbeat size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-emerald-400 to-emerald-600" },
  { name: "Giày Dép Nam", icon: <FaShoePrints size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-sky-400 to-sky-600" },
  { name: "Phụ Kiện Nữ", icon: <FaCrown size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-purple-400 to-purple-600" },
  { name: "Đồng Hồ", icon: <FaClock size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-slate-600 to-slate-800" },
  { name: "Thể Thao & Du Lịch", icon: <FaBicycle size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-teal-400 to-teal-600" },
  { name: "Ô Tô & Xe Máy", icon: <FaMotorcycle size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-red-400 to-red-600" },
  { name: "Bách Hóa Online", icon: <FaShoppingBasket size={30} className="text-white drop-shadow-md" />, bg: "bg-gradient-to-br from-amber-400 to-amber-600" },
];

const CategoryGrid = () => {
  return (
    <div className="bg-white rounded-sm shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-gray-500 font-medium uppercase tracking-wide">Danh Mục</h2>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 border-l border-t border-gray-100">
        {categories.map((cat, index) => (
          <Link 
            key={index} 
            /* 👉 CHỖ NÀY ĐÃ ĐƯỢC SỬA ĐỂ TRUYỀN DỮ LIỆU SANG SEARCH PAGE */
            to={`/search?category=${encodeURIComponent(cat.name)}`} 
            className="flex flex-col items-center justify-center p-4 border-r border-b border-gray-100 hover:shadow-[0_0_15px_rgba(0,0,0,0.08)] hover:z-10 bg-white transition-all group"
          >
            <div className={`w-[60px] h-[60px] mb-3 rounded-2xl ${cat.bg} flex items-center justify-center shadow-inner group-hover:-translate-y-1 group-hover:shadow-lg transition-all duration-300`}>
              {cat.icon}
            </div>
            <span className="text-[13px] text-gray-700 text-center leading-tight line-clamp-2 min-h-[2rem] group-hover:text-blue-600 font-medium transition-colors">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;