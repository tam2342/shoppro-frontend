// src/components/ShopMall.jsx
import { Link } from 'react-router-dom';
import { FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { 
  SiSamsung, SiApple, SiXiaomi, SiOppo, 
  SiSony, SiAdidas, SiNike, SiPanasonic 
} from 'react-icons/si';
// 👉 BỔ SUNG: Import hook điều hướng
import { useBrandNavigation } from "../../hooks/useBrandNavigation";

const mallBrands = [
  { id: 'samsung', icon: <SiSamsung size={56} className="text-[#034ea2]" />, name: "Samsung" },
  { id: 'apple', icon: <SiApple size={44} className="text-[#000000]" />, name: "Apple" },
  { id: 'xiaomi', icon: <SiXiaomi size={44} className="text-[#ff6700]" />, name: "Xiaomi" },
  { id: 'oppo', icon: <SiOppo size={52} className="text-[#008a53]" />, name: "Oppo" },
  { id: 'sony', icon: <SiSony size={56} className="text-[#000000]" />, name: "Sony" },
  { id: 'adidas', icon: <SiAdidas size={48} className="text-[#000000]" />, name: "Adidas" },
  { id: 'nike', icon: <SiNike size={52} className="text-[#000000]" />, name: "Nike" },
  { id: 'panasonic', icon: <SiPanasonic size={52} className="text-[#000000]" />, name: "Panasonic" }
];

const ShopMall = () => {
  // 👉 BỔ SUNG: Khởi tạo hàm từ hook
  const { goToBrand } = useBrandNavigation();

  return (
    <div className="bg-white rounded-sm shadow-sm overflow-hidden mt-6 border border-blue-50">
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white">
        <div className="flex items-center gap-4">
          <h2 className="text-blue-600 text-xl font-extrabold uppercase tracking-wide flex items-center gap-2">
            SHOP PRO MALL
          </h2>
          <div className="hidden md:flex items-center gap-4 text-xs text-gray-600 font-medium">
            <span className="flex items-center gap-1">
              <FiCheckCircle className="text-blue-600 font-bold" /> Trả hàng miễn phí 15 ngày
            </span>
            <span className="flex items-center gap-1">
              <FiCheckCircle className="text-blue-600 font-bold" /> Hàng chính hãng 100%
            </span>
            <span className="flex items-center gap-1">
              <FiCheckCircle className="text-blue-600 font-bold" /> Miễn phí vận chuyển
            </span>
          </div>
        </div>
        <Link to="/mall" className="text-blue-600 text-sm font-semibold flex items-center hover:underline">
          Xem Tất Cả <FiChevronRight className="ml-0.5" />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[30%] p-4 flex">
          <Link 
            className="w-full relative group overflow-hidden rounded-md bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-6 flex flex-col justify-between h-[220px] lg:h-auto min-h-[220px] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
                Chính Hãng 100%
              </span>
              <h3 className="text-2xl font-extrabold text-white leading-tight mt-1">
                Ưu Đãi <br />Thương Hiệu
              </h3>
            </div>
            
            <div className="relative z-10 text-blue-100 text-xs font-light flex items-center gap-1 group-hover:text-white transition-colors">
              <span>Khám phá ngay</span>
              <FiChevronRight className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
        
        {/* LƯỚI BRAND */}
        <div className="lg:w-[70%] grid grid-cols-2 sm:grid-cols-4 border-l border-gray-100">
          {mallBrands.map((brand, index) => (
            // 👉 BỔ SUNG: Thay <Link> bằng <div> và gọi hàm goToBrand
            <div 
              key={index} 
              onClick={() => goToBrand(brand.id, brand.name)}
              className="relative p-6 flex flex-col justify-center items-center h-[125px] border-r border-b border-gray-100 hover:shadow-[0_4px_20px_rgba(37,99,235,0.08)] hover:z-10 bg-white transition-all group overflow-hidden cursor-pointer"
            >
              {/* Icon luôn hiện màu, hover sẽ nảy nhẹ lên và to ra */}
              <div className="transform transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110 drop-shadow-sm group-hover:drop-shadow-md">
                {brand.icon}
              </div>
              
              {/* Tên thương hiệu luôn hiển thị, hover sẽ đổi màu xanh */}
              <span className="text-[11px] font-medium text-gray-500 group-hover:text-blue-600 mt-2 transition-colors duration-300">
                {brand.name}
              </span>

              {/* Vệt sáng chạy ngang ở dưới cùng khi hover (Hiệu ứng trượt) */}
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopMall;