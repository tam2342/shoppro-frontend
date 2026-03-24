import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '../../store/useCartStore';

const Cart = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCartStore();

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      // Tạm thời mô phỏng giảm số lượng bằng cách xóa rồi thêm lại (Nên nâng cấp hàm updateQuantity trong store sau)
      removeFromCart(item._id);
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      useCartStore.setState((state) => ({ cart: [...state.cart, updatedItem] }));
    } else {
      removeFromCart(item._id);
    }
  };

  const handleIncrease = (item) => {
    addToCart(item); // Hàm addToCart cũ của chúng ta đã có logic +1
  };

  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <FiShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Chưa có sản phẩm nào trong giỏ hàng của bạn. Hãy quay lại trang cửa hàng để tiếp tục mua sắm.</p>
        <Link to="/" className="inline-flex items-center px-8 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Giỏ hàng <span className="text-gray-400 text-xl font-medium">({totalItems} sản phẩm)</span></h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          {/* Cột trái: Danh sách sản phẩm */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2"><Link to={`/product/${item._id}`}>{item.name}</Link></h3>
                      {item.variant && <p className="text-sm text-gray-500 mt-1">Phân loại: {item.variant}</p>}
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition p-2 bg-gray-50 rounded-full">
                      <FiTrash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button onClick={() => handleDecrease(item)} className="p-2 text-gray-500 hover:text-blue-600 transition"><FiMinus size={16}/></button>
                      <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                      <button onClick={() => handleIncrease(item)} className="p-2 text-gray-500 hover:text-blue-600 transition"><FiPlus size={16}/></button>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-blue-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cột phải: Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="space-y-4 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Giảm giá</span>
                  <span className="font-medium text-green-600">- 0 ₫</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-base font-bold text-gray-900">Tổng cộng</span>
                <span className="text-2xl font-extrabold text-blue-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                </span>
              </div>

              <Link 
                to="/checkout" 
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] transition flex items-center justify-center gap-2"
              >
                Tiến hành thanh toán <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;