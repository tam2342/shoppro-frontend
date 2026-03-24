import { Link } from 'react-router-dom';
import { FiCheck, FiPackage, FiTruck, FiHome, FiMapPin, FiCreditCard, FiEdit3 } from 'react-icons/fi';

const OrderDetails = () => {
  // Mock data đơn hàng (Đã đổi status thành 'delivered' để test nút Đánh giá)
  const order = {
    id: '#ORD-20260311-XYZ',
    date: '11 Tháng 03, 2026',
    status: 'delivered', // Đổi thành 'delivered' (Giao thành công)
    total: 30040000,
    shippingFee: 50000,
    items: [
      { id: '1', name: 'iPhone 15 Pro Max', variant: '256GB - Titan Tự Nhiên', price: 29990000, qty: 1, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=200' },
    ],
    customer: {
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      address: 'Số 1, Đường X, Phường Y, Dĩ An, Bình Dương',
    }
  };

  // Logic xác định trạng thái timeline
  const steps = [
    { title: 'Đã xác nhận', icon: <FiCheck />, completed: true },
    { title: 'Đang đóng gói', icon: <FiPackage />, completed: true },
    { title: 'Đang vận chuyển', icon: <FiTruck />, completed: true },
    { title: 'Giao hàng thành công', icon: <FiHome />, completed: order.status === 'delivered' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Đơn hàng */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
          <p className="text-gray-500 mt-1">Mã đơn: <span className="font-semibold text-gray-900">{order.id}</span> • Đặt ngày {order.date}</p>
        </div>
        <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm">
          Xuất hóa đơn
        </button>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg font-bold text-gray-900">Trạng thái giao hàng</h2>
          {order.status === 'delivered' && (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <FiCheck /> Đã nhận hàng
            </span>
          )}
        </div>
        
        <div className="relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full hidden sm:block"></div>
          {/* Đường line xanh chạy theo tiến độ */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-600 rounded-full hidden sm:block transition-all duration-1000" style={{ width: order.status === 'delivered' ? '100%' : '66%' }}></div>
          
          <div className="relative flex flex-col sm:flex-row justify-between z-10 gap-6 sm:gap-0">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md text-xl transition-colors duration-500 ${step.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {step.icon}
                </div>
                <div>
                  <h4 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</h4>
                  {step.completed && index === 3 && <p className="text-xs text-blue-600 font-medium mt-1 sm:mt-0">Lúc 10:30, 11/03/2026</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Danh sách sản phẩm */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Sản phẩm đã mua</h2>
            </div>
            <div className="p-6 space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                  <div className="flex gap-4 flex-1">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2"><Link to={`/product/${item.id}`} className="hover:text-blue-600">{item.name}</Link></h3>
                        {item.variant && <p className="text-sm text-gray-500 mt-1">{item.variant}</p>}
                        <p className="text-sm text-gray-500 mt-1">Số lượng: {item.qty}</p>
                      </div>
                      <div className="font-bold text-gray-900 mt-2">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </div>
                    </div>
                  </div>
                  
                  {/* NÚT ĐÁNH GIÁ SẢN PHẨM Ở ĐÂY */}
                  <div className="flex sm:flex-col justify-end items-end gap-2 mt-4 sm:mt-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                    {order.status === 'delivered' ? (
                      <Link 
                        to={`/product/${item.id}`} 
                        className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                      >
                        <FiEdit3 /> Viết đánh giá
                      </Link>
                    ) : (
                      <button className="px-4 py-2 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-sm font-medium w-full sm:w-auto cursor-not-allowed">
                        Đang vận chuyển
                      </button>
                    )}
                    <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
                      Mua lại
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Tổng quan tài chính */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total - order.shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.shippingFee)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Tổng thanh toán</span>
                  <span className="text-xl font-extrabold text-blue-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin khách hàng */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FiMapPin className="mr-2 text-blue-500" /> Thông tin nhận hàng
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p><span className="font-medium text-gray-900">Người nhận:</span> {order.customer.name}</p>
              <p><span className="font-medium text-gray-900">Điện thoại:</span> {order.customer.phone}</p>
              <p className="leading-relaxed"><span className="font-medium text-gray-900">Địa chỉ:</span> {order.customer.address}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <FiCreditCard className="mr-2 text-blue-500" /> Thanh toán
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Phương thức: <span className="font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span></p>
              <p>Trạng thái: <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">Đã thanh toán</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;