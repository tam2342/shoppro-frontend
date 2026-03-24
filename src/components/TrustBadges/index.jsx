import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const features = [
  {
    icon: <FiTruck size={32} className="text-blue-500" />,
    title: 'Miễn phí vận chuyển',
    description: 'Cho mọi đơn hàng từ 500k',
  },
  {
    icon: <FiShield size={32} className="text-teal-500" />,
    title: 'Thanh toán bảo mật',
    description: 'Mã hóa 100% an toàn',
  },
  {
    icon: <FiRefreshCw size={32} className="text-indigo-500" />,
    title: 'Đổi trả dễ dàng',
    description: 'Đổi trả miễn phí trong 30 ngày',
  },
  {
    icon: <FiHeadphones size={32} className="text-purple-500" />,
    title: 'Hỗ trợ 24/7',
    description: 'Luôn sẵn sàng giải đáp',
  },
];

const TrustBadges = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        {features.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
            <div className="p-3 bg-gray-50 group-hover:bg-white rounded-full shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
              {item.icon}
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;