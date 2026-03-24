import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Lấy nguyên cục URL (các thông số VNPAY trả về) bắn xuống Backend
        const { data } = await axios.get(`https://shoppro-backend-k01l.onrender.com/api/orders/vnpay-return${window.location.search}`);
        
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    if (searchParams.toString()) {
      verifyPayment();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900">Đang xác thực thanh toán...</h2>
            <p className="text-gray-500 mt-2">Vui lòng không tắt trình duyệt</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-fade-in-up">
            <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-8">Cảm ơn bạn đã mua sắm tại ShopPro. Đơn hàng của bạn đang được xử lý.</p>
            <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
              Tiếp tục mua sắm
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-fade-in-up">
            <FiXCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Giao dịch thất bại!</h2>
            <p className="text-gray-600 mb-8">Đã có lỗi xảy ra hoặc bạn đã hủy giao dịch. Vui lòng thử lại sau.</p>
            <Link to="/cart" className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-bold hover:bg-gray-300 transition">
              Quay lại giỏ hàng
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VNPayReturn;