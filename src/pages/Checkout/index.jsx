import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore'; 

const VIETNAM_PROVINCES = [
  { value: 'Hà Nội', label: 'Hà Nội' }, { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' }, { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Cần Thơ', label: 'Cần Thơ' }, { value: 'An Giang', label: 'An Giang' },
  { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' }, { value: 'Bắc Giang', label: 'Bắc Giang' },
  { value: 'Bắc Kạn', label: 'Bắc Kạn' }, { value: 'Bạc Liêu', label: 'Bạc Liêu' },
  { value: 'Bắc Ninh', label: 'Bắc Ninh' }, { value: 'Bến Tre', label: 'Bến Tre' },
  { value: 'Bình Định', label: 'Bình Định' }, { value: 'Bình Dương', label: 'Bình Dương' },
  { value: 'Bình Phước', label: 'Bình Phước' }, { value: 'Bình Thuận', label: 'Bình Thuận' },
  { value: 'Cà Mau', label: 'Cà Mau' }, { value: 'Cao Bằng', label: 'Cao Bằng' },
  { value: 'Đắk Lắk', label: 'Đắk Lắk' }, { value: 'Đắk Nông', label: 'Đắk Nông' },
  { value: 'Điện Biên', label: 'Điện Biên' }, { value: 'Đồng Nai', label: 'Đồng Nai' },
  { value: 'Đồng Tháp', label: 'Đồng Tháp' }, { value: 'Gia Lai', label: 'Gia Lai' },
  { value: 'Hà Giang', label: 'Hà Giang' }, { value: 'Hà Nam', label: 'Hà Nam' },
  { value: 'Hà Tĩnh', label: 'Hà Tĩnh' }, { value: 'Hải Dương', label: 'Hải Dương' },
  { value: 'Hậu Giang', label: 'Hậu Giang' }, { value: 'Hòa Bình', label: 'Hòa Bình' },
  { value: 'Hưng Yên', label: 'Hưng Yên' }, { value: 'Khánh Hòa', label: 'Khánh Hòa' },
  { value: 'Kiên Giang', label: 'Kiên Giang' }, { value: 'Kon Tum', label: 'Kon Tum' },
  { value: 'Lai Châu', label: 'Lai Châu' }, { value: 'Lâm Đồng', label: 'Lâm Đồng' },
  { value: 'Lạng Sơn', label: 'Lạng Sơn' }, { value: 'Lào Cai', label: 'Lào Cai' },
  { value: 'Long An', label: 'Long An' }, { value: 'Nam Định', label: 'Nam Định' },
  { value: 'Nghệ An', label: 'Nghệ An' }, { value: 'Ninh Bình', label: 'Ninh Bình' },
  { value: 'Ninh Thuận', label: 'Ninh Thuận' }, { value: 'Phú Thọ', label: 'Phú Thọ' },
  { value: 'Quảng Bình', label: 'Quảng Bình' }, { value: 'Quảng Nam', label: 'Quảng Nam' },
  { value: 'Quảng Ngãi', label: 'Quảng Ngãi' }, { value: 'Quảng Ninh', label: 'Quảng Ninh' },
  { value: 'Quảng Trị', label: 'Quảng Trị' }, { value: 'Sóc Trăng', label: 'Sóc Trăng' },
  { value: 'Sơn La', label: 'Sơn La' }, { value: 'Tây Ninh', label: 'Tây Ninh' },
  { value: 'Thái Bình', label: 'Thái Bình' }, { value: 'Thái Nguyên', label: 'Thái Nguyên' },
  { value: 'Thanh Hóa', label: 'Thanh Hóa' }, { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
  { value: 'Tiền Giang', label: 'Tiền Giang' }, { value: 'Trà Vinh', label: 'Trà Vinh' },
  { value: 'Tuyên Quang', label: 'Tuyên Quang' }, { value: 'Vĩnh Long', label: 'Vĩnh Long' },
  { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' }, { value: 'Yên Bái', label: 'Yên Bái' },
  { value: 'Phú Yên', label: 'Phú Yên' }
];

const Checkout = () => {
  const { cart, clearCart } = useCartStore();
  const { user } = useAuthStore(); 
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: null 
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

    if (!shippingAddress.city) {
      alert('Vui lòng chọn Thành phố / Tỉnh!');
      return;
    }

    try {
      const orderItems = cart.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id.split('-')[0], 
        seller: item.seller 
      }));

      const orderData = {
        orderItems,
        shippingAddress: {
          fullName: shippingAddress.fullName || "Khách hàng Test",
          phone: shippingAddress.phone || "0909000000",
          address: shippingAddress.address || "123 Đường Test",
          city: shippingAddress.city.value 
        },
        paymentMethod,
        itemsPrice: totalAmount,
        shippingPrice: shippingFee,
        totalPrice: totalAmount + shippingFee,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('https://shoppro-backend-k01l.onrender.com/api/orders', orderData, config);

      if (paymentMethod === 'VNPAY') {
        const { data: vnpayData } = await axios.post(`https://shoppro-backend-k01l.onrender.com/api/orders/${data._id}/pay`, {}, config);
        clearCart(); 
        window.location.href = vnpayData.url; 
      } else if (paymentMethod === 'PAYPAL') {
        // 👉 ĐÃ FIX: Mở khóa đoạn code gọi API PayPal và chuyển hướng
        const { data: paypalData } = await axios.post(`https://shoppro-backend-k01l.onrender.com/api/orders/${data._id}/paypal`, {}, config);
        clearCart();
        window.location.href = paypalData.url;
      } else {
        alert('🎉 Đặt hàng COD thành công! Đơn hàng đã được gửi tới Shop.');
        clearCart(); 
        navigate(`/order/${data._id}`); 
      }

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      console.error("🚨 Lỗi đặt hàng chi tiết:", errorMsg);
      alert('Có lỗi xảy ra khi đặt hàng: ' + errorMsg);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: '6px 4px',
      borderRadius: '0.75rem',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af'
      }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '0.75rem',
      overflow: 'hidden',
      zIndex: 50
    })
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Thanh toán</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start flex flex-col-reverse">
          <div className="lg:col-span-7 space-y-8 w-full mt-8 lg:mt-0">
            
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố / Tỉnh</label>
                    <Select
                      options={VIETNAM_PROVINCES}
                      value={shippingAddress.city}
                      onChange={(selectedOption) => setShippingAddress({ ...shippingAddress, city: selectedOption })}
                      placeholder="Chọn Tỉnh/Thành phố..."
                      isSearchable={true}
                      styles={customSelectStyles}
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
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
                </div>
              </form>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>
              <div className="space-y-4">
                
                {/* Thanh toán COD */}
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

                {/* Thanh toán VNPAY */}
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
                    <span className={`block font-bold ${paymentMethod === 'VNPAY' ? 'text-blue-900' : 'text-gray-900'}`}>Chuyển khoản nội địa (VNPAY)</span>
                    <span className="block text-sm text-gray-500 mt-1">Hỗ trợ quét mã QR, thẻ ATM, Visa/Mastercard phát hành tại Việt Nam.</span>
                    
                    {paymentMethod === 'VNPAY' && (
                      <div className="mt-3 p-3 bg-blue-100/50 rounded-lg border border-blue-200 animate-fade-in-up">
                        <p className="text-sm text-blue-700 font-medium flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Hệ thống sẽ chuyển hướng tới cổng thanh toán VNPAY an toàn.
                        </p>
                      </div>
                    )}
                  </div>
                </label>

                {/* Thanh toán Quốc tế (PayPal/Stripe) */}
                <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${paymentMethod === 'PAYPAL' ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="PAYPAL"
                    checked={paymentMethod === 'PAYPAL'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" 
                  />
                  <div className="ml-4 flex-1">
                    <span className={`block font-bold ${paymentMethod === 'PAYPAL' ? 'text-blue-900' : 'text-gray-900'}`}>Thanh toán quốc tế (PayPal / Thẻ tín dụng)</span>
                    <span className="block text-sm text-gray-500 mt-1">Giao dịch an toàn qua cổng thanh toán quốc tế dành cho khách hàng nước ngoài.</span>
                    
                    {paymentMethod === 'PAYPAL' && (
                      <div className="mt-3 p-3 bg-blue-100/50 rounded-lg border border-blue-200 animate-fade-in-up">
                        <p className="text-sm text-blue-700 font-medium flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Tỉ giá quy đổi sẽ được áp dụng theo chuẩn quốc tế tại thời điểm thanh toán.
                        </p>
                      </div>
                    )}
                  </div>
                </label>

              </div>
            </div>
          </div>

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
                {paymentMethod === 'VNPAY' || paymentMethod === 'PAYPAL' ? 'Thanh toán & Đặt hàng' : 'Đặt hàng ngay'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;