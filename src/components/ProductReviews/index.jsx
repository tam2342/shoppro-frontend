import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore'; // Import Store kiểm tra đăng nhập

const ProductReviews = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore(); // Lấy thông tin user hiện tại

  // State quản lý danh sách đánh giá (Để khi thêm mới, nó hiện ra luôn)
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      name: 'Trần Văn B',
      date: '08 Tháng 03, 2026',
      rating: 5,
      content: 'Máy đẹp xuất sắc, thiết kế Titan cầm rất nhẹ tay. Camera chụp đêm cực kỳ ấn tượng, hoàn toàn hài lòng với mức giá bỏ ra.',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Lê Thị C',
      date: '02 Tháng 03, 2026',
      rating: 4,
      content: 'Giao hàng nhanh chóng đóng gói cẩn thận. Pin trâu bò dùng cả ngày không hết. Trừ 1 sao vì viền bám vân tay hơi nhiều.',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop'
    }
  ]);

  // State cho Form đánh giá
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5); // Mặc định 5 sao
  const [newComment, setNewComment] = useState('');

  // Xử lý khi bấm nút "Viết đánh giá"
  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để viết đánh giá!');
      navigate('/login'); // Chuyển hướng sang trang đăng nhập
    } else {
      setShowForm(!showForm); // Bật/tắt form
    }
  };

  // Xử lý khi Submit form đánh giá
  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (newComment.trim() === '') {
      alert('Vui lòng nhập nội dung đánh giá!');
      return;
    }

    // Tạo object đánh giá mới dựa trên thông tin User đang đăng nhập
    const newReview = {
      id: Date.now(),
      name: user.name, // Lấy tên thật từ store
      date: new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date()),
      rating: newRating,
      content: newComment,
      isVerified: true, // Tạm thời giả lập là đã mua hàng
      avatar: `https://ui-avatars.com/api/?name=${user.name}&background=2563eb&color=fff` // Tạo avatar chữ cái
    };

    // Đẩy đánh giá mới lên đầu danh sách
    setReviewsList([newReview, ...reviewsList]);
    
    // Reset form và đóng lại
    setNewComment('');
    setNewRating(5);
    setShowForm(false);
    alert('Cảm ơn bạn đã đánh giá sản phẩm!');
  };

  return (
    <div className="border-t border-gray-100 pt-16 mt-16">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Đánh giá từ khách hàng</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Cột trái: Thống kê Rating & Nút Viết đánh giá */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <div className="text-5xl font-extrabold text-gray-900">4.8</div>
            <div className="flex justify-center text-yellow-400 my-3">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-yellow-200" />
            </div>
            <p className="text-sm text-gray-500">Dựa trên {reviewsList.length} lượt đánh giá</p>
          </div>

          <button 
            onClick={handleWriteReviewClick}
            className={`mt-8 w-full border-2 font-bold py-3 rounded-xl transition-colors ${
              showForm 
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
            }`}
          >
            {showForm ? 'Hủy đánh giá' : 'Viết đánh giá'}
          </button>
        </div>

        {/* Cột phải: Form đánh giá & Danh sách Comments */}
        <div className="md:col-span-8 lg:col-span-9 space-y-8">
          
          {/* VÙNG FORM ĐÁNH GIÁ MỚI THÊM VÀO (Chỉ hiện khi showForm = true) */}
          {showForm && (
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8 animation-fade-in">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Bạn đánh giá sản phẩm này thế nào?</h3>
              <form onSubmit={handleSubmitReview}>
                {/* Chọn số sao tương tác */}
                <div className="flex mb-4 gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      type="button" 
                      key={star} 
                      onClick={() => setNewRating(star)}
                      className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      {star <= newRating ? <FaStar className="text-yellow-400" /> : <FiStar className="text-gray-400" />}
                    </button>
                  ))}
                </div>
                
                {/* Khung nhập nội dung */}
                <textarea 
                  rows="4" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm..."
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition mb-4 resize-none"
                ></textarea>
                
                <div className="flex justify-end">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">
                    Gửi đánh giá
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Danh sách Comments được lấy từ State (để cập nhật real-time) */}
          {reviewsList.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      {review.isVerified && (
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Đã mua hàng
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <div className="flex text-yellow-400 mr-3 text-xs">
                        {[...Array(5)].map((_, i) => (
                          i < review.rating ? <FaStar key={i} /> : <FiStar key={i} className="text-gray-300" />
                        ))}
                      </div>
                      {review.date}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;