// src/components/UserOrderList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const UserOrderList = () => {
  const [orders, setOrders] = useState([]);
  const user = useAuthStore((state) => state.user);
  const token = user?.token || useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('https://shoppro-backend-k01l.onrender.com/api/orders/myorders', config);
        setOrders(data);
      } catch (error) {
        console.error("Lỗi lấy đơn hàng cá nhân:", error);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 font-bold text-lg">Đơn hàng của tôi</div>
      {orders.length === 0 ? (
        <p className="p-8 text-center text-gray-500">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <div key={order._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition gap-4">
              <div>
                <p className="font-bold text-gray-900">Mã đơn: #{order._id.substring(0, 8).toUpperCase()}</p>
                <p className="text-sm text-gray-500 mt-1">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                <div className="mt-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.status === 'Đã giao' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end">
                <p className="font-extrabold text-blue-600 text-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}
                </p>
                <Link to={`/order/${order._id}`} className="text-sm font-medium text-blue-500 hover:text-blue-700 hover:underline mt-2 inline-block">
                  Xem chi tiết &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrderList;