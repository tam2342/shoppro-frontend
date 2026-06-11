import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEye, FiCheck, FiTruck, FiPackage, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
// 👉 BƯỚC 1: Import Zustand store giống hệt trang Login
import { useAuthStore } from '../../store/useAuthStore';

const SellerOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 👉 BƯỚC 2: Gọi user từ store ra (Tuyệt đối không dùng localStorage chay nữa)
  const user = useAuthStore((state) => state.user);
  
  // Lấy token (Đề phòng store lưu token ở ngoài hoặc trong object user)
  const token = user?.token || useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      fetchSellerOrders();
    }
  }, [token]);

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const { data } = await axios.get('https://shoppro-backend-k01l.onrender.com/api/orders/seller/all', config);
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Xác nhận chuyển đơn hàng sang trạng thái: ${newStatus}?`)) return;

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.put(`https://shoppro-backend-k01l.onrender.com/api/orders/${orderId}/status`, { status: newStatus }, config);
      
      fetchSellerOrders();
      alert('Đã cập nhật trạng thái đơn hàng!');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Chờ xác nhận':
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><FiPackage className="mr-1"/> Chờ duyệt</span>;
      case 'Đang xử lý':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><FiCheck className="mr-1"/> Đang chuẩn bị</span>;
      case 'Đang giao hàng':
        return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><FiTruck className="mr-1"/> Đang giao</span>;
      case 'Đã giao':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit"><FiCheckCircle className="mr-1"/> Thành công</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold w-fit">{status}</span>;
    }
  };

  // NẾU CHƯA ĐĂNG NHẬP (KHÔNG CÓ TOKEN)
  if (!token) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-red-500 mb-2">Chưa xác thực danh tính</h3>
        <p className="text-gray-600 mb-4">Vui lòng đăng nhập bằng tài khoản Seller để xem danh sách đơn hàng.</p>
        <Link to="/login" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
          Đi đến trang Đăng nhập
        </Link>
      </div>
    );
  }

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải danh sách đơn hàng...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium">Lỗi: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Quản lý Đơn hàng</h2>
        <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold">
          Tổng cộng: {orders.length} đơn
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-y border-gray-200">
              <th className="py-4 px-4 font-semibold">Mã đơn / Ngày đặt</th>
              <th className="py-4 px-4 font-semibold">Khách hàng</th>
              <th className="py-4 px-4 font-semibold">Tổng tiền</th>
              <th className="py-4 px-4 font-semibold">Trạng thái</th>
              <th className="py-4 px-4 font-semibold text-center">Thao tác duyệt</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">Chưa có đơn hàng nào.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-blue-600">#{order._id.substring(0, 8).toUpperCase()}</div>
                    <div className="text-gray-500 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-gray-800">{order.shippingAddress?.fullName}</div>
                    <div className="text-gray-500 text-xs">{order.shippingAddress?.city}</div>
                  </td>
                  <td className="py-4 px-4 font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
                    <div className="text-xs text-gray-500 font-normal mt-0.5">{order.paymentMethod}</div>
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link to={`/order/${order._id}`} className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition tooltip" title="Xem chi tiết">
                        <FiEye size={18} />
                      </Link>
                      
                      {order.status === 'Chờ xác nhận' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Đang xử lý')} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition shadow-sm">
                          Duyệt đơn
                        </button>
                      )}
                      {order.status === 'Đang xử lý' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Đang giao hàng')} className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded hover:bg-purple-700 transition shadow-sm">
                          Giao ĐVVC
                        </button>
                      )}
                      {order.status === 'Đang giao hàng' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Đã giao')} className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 transition shadow-sm">
                          Xác nhận Đã giao
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrderList;