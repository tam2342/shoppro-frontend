// src/components/TrustBadges.jsx
import { FiCheckCircle, FiShield, FiPackage, FiRefreshCw } from 'react-icons/fi';

const badges = [
  { 
    icon: <FiCheckCircle className="w-6 h-6 text-blue-600" />, 
    title: "Cam kết 100% chính hãng" 
  },
  { 
    icon: <FiShield className="w-6 h-6 text-teal-500" />, 
    title: "Hoàn tiền 111% nếu giả" 
  },
  { 
    icon: <FiPackage className="w-6 h-6 text-orange-500" />, 
    title: "Mở hộp kiểm tra nhận hàng" 
  },
  { 
    icon: <FiRefreshCw className="w-6 h-6 text-red-500" />, 
    title: "Đổi trả trong 30 ngày" 
  },
];

const TrustBadges = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-0 py-4 hidden sm:block">
      <div className="flex items-center justify-between">
        {badges.map((item, index) => (
          <div key={index} className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="bg-gray-50 p-1.5 rounded-full">
              {item.icon}
            </div>
            <span className="text-sm font-medium text-gray-700">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;