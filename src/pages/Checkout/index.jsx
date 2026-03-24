import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore'; // Import để lấy token

const Checkout = () => {
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore(); // Lấy thông tin user đang đăng nhập
  const navigate = useNavigate();
  
  // State quản lý phương thức thanh toán ('COD' hoặc 'VNPAY')
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // State quản lý thông tin giao hàng
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = totalAmount > 0 ? 50000 : 0;

  const handlePlaceOrder = async (e) => {
    e.preventDefault(); 
    
    if (cart.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    if (!user) {
      alert('Vui lòng đăng nhập để đặt hàng!');
      return;
    }

    try {
      // 1. Chuẩn bị dữ liệu để gửi xuống Backend
      const orderItems = cart.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id.split('-')[0], // Lấy ID gốc của sản phẩm
        seller: item.seller // Cực kỳ quan trọng để chia đơn cho các Shop
      }));

      const orderData = {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: totalAmount,
        shippingPrice: shippingFee,
        totalPrice: totalAmount + shippingFee,
      };

      // 2. Gắn Token bảo mật và Bắn API tạo đơn hàng
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('https://shoppro-backend-k01l.onrender.com/api/orders', orderData, config);

      // 3. XỬ LÝ SAU KHI TẠO ĐƠN THÀNH CÔNG (ĐÃ NÂNG CẤP VNPAY)
      if (paymentMethod === 'VNPAY') {
        
        // Gọi API lấy đường link thanh toán của VNPAY
        const { data: vnpayData } = await axios.post(`https://shoppro-backend-k01l.onrender.com/api/orders/${data._id}/pay`, {}, config);
        
        // Xóa sạch giỏ hàng
        clearCart(); 
        
        // Chuyển hướng người dùng thẳng sang trang ngân hàng của VNPAY
        window.location.href = vnpayData.url; 

      } else {
        alert('🎉 Đặt hàng COD thành công! Đơn hàng đã được gửi tới Shop.');
        clearCart(); // Xóa sạch giỏ hàng
        navigate(`/order/${data._id}`); // Chuyển tới trang xem chi tiết hóa đơn
      }

    } catch (error) {
      console.error("Lỗi đặt hàng:", error.response?.data?.message || error.message);
      alert('Có lỗi xảy ra khi đặt hàng: ' + (error.response?.data?.message || error.message));
    }
  };

  // Hàm cập nhật state khi khách gõ vào input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Thanh toán</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start flex flex-col-reverse">
          {/* Cột trái: Form thông tin */}
          <div className="lg:col-span-7 space-y-8 w-full mt-8 lg:mt-0">
            {/* Box 1: Địa chỉ giao hàng */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin giao hàng</h2>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="Ví dụ: Nguyễn Văn A" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="090 123 4567" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể</label>
                  <input 
                    type="text" 
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                    placeholder="Số nhà, Tên đường, Phường/Xã..." 
                  />
                </div>
              </form>
            </div>

            {/* Box 2: Phương thức thanh toán */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>
              <div className="space-y-4">
                
                {/* Lựa chọn 1: COD */}
                <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" 
                  />
                  <div className="ml-4">
                    <span className={`block font-bold ${paymentMethod === 'COD' ? 'text-blue-900' : 'text-gray-900'}`}>Thanh toán khi nhận hàng (COD)</span>
                    <span className="block text-sm text-gray-500 mt-1">Thanh toán bằng tiền mặt khi shipper giao hàng tới.</span>
                  </div>
                </label>

                {/* Lựa chọn 2: Chuyển khoản / Ví điện tử */}
                <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'VNPAY' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="VNPAY"
                    checked={paymentMethod === 'VNPAY'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" 
                  />
                  <div className="ml-4 flex-1">
                    <span className={`block font-bold ${paymentMethod === 'VNPAY' ? 'text-blue-900' : 'text-gray-900'}`}>Chuyển khoản / Ví điện tử</span>
                    <span className="block text-sm text-gray-500 mt-1">Hỗ trợ quét mã QR qua VNPay, MoMo, ZaloPay hoặc các thẻ ngân hàng nội địa.</span>
                    
                    {paymentMethod === 'VNPAY' && (
                      <div className="mt-3 p-3 bg-blue-100/50 rounded-lg border border-blue-200 animate-fade-in-up">
                        <p className="text-sm text-blue-700 font-medium flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Sau khi đặt hàng, hệ thống sẽ chuyển hướng bạn tới cổng thanh toán an toàn.
                        </p>
                      </div>
                    )}
                  </div>
                </label>

              </div>
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Đơn hàng của bạn</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 hide-scrollbar">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6 border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-8 border-t border-gray-100 pt-4">
                  <span className="text-base font-bold text-gray-900">Tổng thanh toán</span>
                  <span className="text-2xl font-extrabold text-blue-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount + shippingFee)}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] transition flex items-center justify-center"
              >
                {paymentMethod === 'VNPAY' ? 'Thanh toán & Đặt hàng' : 'Đặt hàng ngay'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;