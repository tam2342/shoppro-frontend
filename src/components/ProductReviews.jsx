import { useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiStar, FiFilter, FiThumbsUp, FiCheck, FiX, FiEdit2, FiTrash2, FiCamera } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useAuthStore } from '../store/useAuthStore';

const ProductReviews = () => {
  const { id } = useParams(); 
  const { user } = useAuthStore();
  const token = user?.token || useAuthStore((state) => state.token);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // 👉 State hiển thị đang tải ảnh

  // States: Form Thêm mới
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const fileInputRef = useRef(null);

  // States: Form Chỉnh sửa
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [editMediaFiles, setEditMediaFiles] = useState([]);
  const editFileInputRef = useRef(null);

  // States: Giao diện
  const [zoomedMedia, setZoomedMedia] = useState(null);
  const [filterStar, setFilterStar] = useState('all');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // ================= FETCH DỮ LIỆU TỪ MONGODB =================
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://shoppro-backend-k01l.onrender.com/api/products/${id}`);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách đánh giá:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReviews();
  }, [id]);

  // ================= HÀM UPLOAD LÊN CLOUDINARY =================
  const uploadMediaToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'shoppro_unsigned'); // Tên thẻ thông hành vừa tạo

    try {
      // Dùng auto upload để nó tự nhận diện là image hay video
      const res = await axios.post('https://api.cloudinary.com/v1_1/dr27et5vv/auto/upload', formData);
      return res.data.secure_url; // Trả về link xịn
    } catch (error) {
      console.error("Lỗi upload Cloudinary:", error);
      throw new Error("Không thể tải file lên hệ thống.");
    }
  };

  // ================= XỬ LÝ FILE (THÊM & SỬA) =================
  const handleFileChange = (e, isEdit = false) => {
    const files = Array.from(e.target.files);
    const currentMedia = isEdit ? editMediaFiles : mediaFiles;
    
    if (files.length + currentMedia.length > 5) {
      return alert('Chỉ được tải lên tối đa 5 hình/video');
    }

    const newMedia = files.map(file => ({
      file, // File gốc để gửi lên Cloudinary
      preview: URL.createObjectURL(file), // Link blob tạm để hiển thị trước
      type: file.type.startsWith('video/') ? 'video' : 'image'
    }));

    if (isEdit) setEditMediaFiles([...currentMedia, ...newMedia]);
    else setMediaFiles([...currentMedia, ...newMedia]);
    e.target.value = ''; // Reset input
  };

  const removeMedia = (index, isEdit = false) => {
    if (isEdit) setEditMediaFiles(editMediaFiles.filter((_, i) => i !== index));
    else setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  // ================= GỌI API: THÊM MỚI =================
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return alert('Vui lòng nhập nội dung đánh giá!');

    try {
      setIsUploading(true); // Bật hiệu ứng loading chờ up ảnh

      // 1. Duyệt qua mảng file, up từng hình lên Cloudinary để lấy link xịn
      const uploadedUrls = [];
      for (const media of mediaFiles) {
        const url = await uploadMediaToCloudinary(media.file);
        uploadedUrls.push(url);
      }

      // 2. Gói data chứa link xịn gửi cho Backend
      const reviewData = {
        rating: newRating,
        comment: newComment,
        images: uploadedUrls 
      };
      
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      await axios.post(`https://shoppro-backend-k01l.onrender.com/api/products/${id}/reviews`, reviewData, config);
      
      alert('Đã gửi đánh giá thành công!');
      setNewComment('');
      setNewRating(5);
      setMediaFiles([]);
      fetchReviews(); 
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Không thể gửi đánh giá');
    } finally {
      setIsUploading(false); // Tắt hiệu ứng loading
    }
  };

  // ================= GỌI API: XÓA =================
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`https://shoppro-backend-k01l.onrender.com/api/products/${id}/reviews/${reviewId}`, config);
        fetchReviews();
      } catch (error) {
        alert(error.response?.data?.message || 'Lỗi xóa đánh giá');
      }
    }
  };

  // ================= GỌI API: SỬA =================
  const handleStartEdit = (review) => {
    setEditingId(review._id || review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
    
    // Nạp ảnh cũ vào form sửa (Những ảnh này ĐÃ CÓ link xịn Cloudinary, không có thuộc tính "file")
    const existingMedia = (review.images || []).map(url => ({
      preview: url, 
      type: url.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image' 
    }));
    setEditMediaFiles(existingMedia);
  };

  const handleSaveEdit = async (e, reviewId) => {
    e.preventDefault();
    if (editComment.trim() === '') return alert('Nội dung không được để trống!');
    
    try {
      setIsUploading(true);

      const uploadedUrls = [];
      for (const media of editMediaFiles) {
        if (media.file) {
          // Trường hợp 1: Đây là ảnh/video mới được thêm vào -> Phải up lên Cloudinary
          const url = await uploadMediaToCloudinary(media.file);
          uploadedUrls.push(url);
        } else {
          // Trường hợp 2: Đây là ảnh cũ từ Database -> Cứ giữ nguyên link cũ
          uploadedUrls.push(media.preview);
        }
      }

      const reviewData = {
        rating: editRating,
        comment: editComment,
        images: uploadedUrls 
      };

      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };
      await axios.put(`https://shoppro-backend-k01l.onrender.com/api/products/${id}/reviews/${reviewId}`, reviewData, config);
      
      setEditingId(null);
      fetchReviews();
    } catch (error) {
      alert(error.response?.data?.message || error.message || 'Lỗi cập nhật đánh giá');
    } finally {
      setIsUploading(false);
    }
  };

  // ================= LỌC & SẮP XẾP =================
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];
    if (filterStar !== 'all') result = result.filter(review => review.rating === filterStar);
    if (filterSentiment === 'positive') result = result.filter(review => review.rating >= 4);
    else if (filterSentiment === 'negative') result = result.filter(review => review.rating <= 3);

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [reviews, filterStar, filterSentiment, sortBy]);

  const StarDisplay = ({ count }) => (
    <div className="flex text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar key={star} size={14} className={star <= count ? "text-yellow-400" : "text-gray-300"} />
      ))}
    </div>
  );

  if (loading) return <div className="text-center py-6 text-gray-400">Đang tải bình luận...</div>;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-sm relative">
      <h2 className="text-2xl font-bold text-black mb-8">Khách hàng đánh giá</h2>

      {/* ================= FORM VIẾT ĐÁNH GIÁ (THÊM MỚI) ================= */}
      {user ? (
        <div className="mb-12 p-6 sm:p-8 bg-gray-50 rounded-2xl border border-gray-200">
          <h3 className="text-lg font-bold text-black mb-4">Bạn đánh giá sản phẩm này thế nào?</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="flex mb-4 gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button type="button" key={star} onClick={() => setNewRating(star)} className="text-2xl hover:scale-110 transition">
                  {star <= newRating ? <FaStar className="text-yellow-400" /> : <FiStar className="text-gray-400" />}
                </button>
              ))}
            </div>
            
            <textarea 
              rows="4" value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-1 focus:ring-black outline-none mb-4 resize-none"
            />
            
            {/* VÙNG UPLOAD ẢNH (THÊM MỚI) */}
            <div className="mb-4 flex flex-wrap gap-4">
              {mediaFiles.map((media, index) => (
                <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                  {media.type === 'video' ? (
                     <video src={media.preview} className="w-full h-full object-cover" />
                  ) : (
                     <img src={media.preview} alt="preview" className="w-full h-full object-cover" />
                  )}
                  <button type="button" onClick={() => removeMedia(index, false)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              
              {mediaFiles.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current.click()} className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-black hover:border-black transition bg-white">
                  <FiCamera size={20} className="mb-1" />
                  <span className="text-[10px] font-medium">Thêm ảnh</span>
                </button>
              )}
              <input type="file" hidden ref={fileInputRef} onChange={(e) => handleFileChange(e, false)} multiple accept="image/*,video/*" />
            </div>

            <div className="flex justify-end">
              <button disabled={isUploading} type="submit" className={`px-8 py-3 font-bold rounded-xl transition ${isUploading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'}`}>
                {isUploading ? 'Đang xử lý file...' : 'Gửi đánh giá'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-12 p-6 bg-gray-50 text-gray-500 rounded-2xl border text-center text-sm font-medium">
          Vui lòng <a href="/login" className="text-black font-bold hover:underline">Đăng nhập</a> để viết đánh giá.
        </div>
      )}

      {/* ================= THANH BỘ LỌC ================= */}
      <div className="flex flex-col lg:flex-row gap-8 mb-10 pb-10 border-b border-gray-100">
        <div className="flex flex-col items-center justify-center lg:pr-10 lg:border-r min-w-[200px]">
          <div className="text-5xl font-extrabold text-black mb-2">
            {reviews.length > 0 ? (reviews.reduce((a, c) => a + c.rating, 0) / reviews.length).toFixed(1) : "0.0"}
          </div>
          <StarDisplay count={5} />
          <div className="text-sm text-gray-500 mt-2">{reviews.length} bài đánh giá</div>
        </div>

        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold mb-2 flex items-center gap-2"><FiFilter /> Lọc theo:</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setFilterStar('all'); setFilterSentiment('all'); }} className={`px-4 py-2 rounded-full text-sm font-medium border ${filterStar === 'all' && filterSentiment === 'all' ? 'bg-black text-white' : 'bg-white text-gray-600'}`}>Tất cả</button>
            {[5, 4, 3, 2, 1].map(star => (
              <button key={star} onClick={() => { setFilterStar(star); setFilterSentiment('all'); }} className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-1 ${filterStar === star ? 'bg-black text-white' : 'bg-white text-gray-600'}`}>
                {star} <FaStar size={12} className={filterStar === star ? 'text-yellow-400' : 'text-gray-400'} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= DANH SÁCH BÌNH LUẬN ================= */}
      <div className="space-y-8">
        {filteredAndSortedReviews.length === 0 ? (
          <p className="text-center py-10 text-gray-500">Chưa có đánh giá nào.</p>
        ) : (
          filteredAndSortedReviews.map((review) => {
            const reviewId = review._id || review.id;
            const isMyReview = user && (
              review.user === user._id || 
              review.user?._id === user._id ||
              review.name?.toLowerCase().trim() === user.name?.toLowerCase().trim()
            );

            return (
              <div key={reviewId} className="flex gap-4 border-b border-gray-100 pb-8 relative">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 uppercase shadow-sm">
                  {review.name?.charAt(0)}
                </div>
                
                <div className="flex-1">
                  {editingId === reviewId ? (
                    /* FORM CHỈNH SỬA */
                    <div className="bg-gray-50 p-6 rounded-2xl border">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Chỉnh sửa đánh giá</h3>
                        <button onClick={() => setEditingId(null)}><FiX size={20}/></button>
                      </div>
                      <form onSubmit={(e) => handleSaveEdit(e, reviewId)}>
                        <div className="flex mb-4 gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button type="button" key={star} onClick={() => setEditRating(star)} className="text-2xl">
                              {star <= editRating ? <FaStar className="text-yellow-400" /> : <FiStar className="text-gray-400" />}
                            </button>
                          ))}
                        </div>
                        <textarea rows="3" value={editComment} onChange={(e) => setEditComment(e.target.value)} className="w-full p-4 rounded-xl border mb-4 outline-none resize-none" />
                        
                        {/* VÙNG UPLOAD ẢNH (KHI SỬA) */}
                        <div className="mb-4 flex flex-wrap gap-4">
                          {editMediaFiles.map((media, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 group">
                              {media.type === 'video' ? (
                                <video src={media.preview} className="w-full h-full object-cover" />
                              ) : (
                                <img src={media.preview} alt="preview" className="w-full h-full object-cover" />
                              )}
                              <button type="button" onClick={() => removeMedia(index, true)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                                <FiX size={12} />
                              </button>
                            </div>
                          ))}
                          
                          {editMediaFiles.length < 5 && (
                            <button type="button" onClick={() => editFileInputRef.current.click()} className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-black hover:border-black transition bg-white">
                              <FiCamera size={20} className="mb-1" />
                              <span className="text-[10px] font-medium">Thêm ảnh</span>
                            </button>
                          )}
                          <input type="file" hidden ref={editFileInputRef} onChange={(e) => handleFileChange(e, true)} multiple accept="image/*,video/*" />
                        </div>

                        <div className="flex justify-end gap-3">
                          <button disabled={isUploading} type="button" onClick={() => setEditingId(null)} className="px-4 py-2 font-medium">Hủy</button>
                          <button disabled={isUploading} type="submit" className={`px-6 py-2 rounded-lg font-bold transition ${isUploading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-black text-white'}`}>
                            {isUploading ? 'Đang lưu...' : 'Lưu thay đổi'}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* HIỂN THỊ ĐÁNH GIÁ BÌNH THƯỜNG */
                    <>
                      <div className="flex flex-col sm:flex-row justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{review.name}</h4>
                          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Đã mua hàng</span>
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(review.createdAt || review.date || Date.now()).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      
                      <div className="mb-3"><StarDisplay count={review.rating} /></div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-line">{review.comment}</p>

                      {/* HIỂN THỊ ẢNH/VIDEO ĐÃ UPLOAD CỦA BÌNH LUẬN NÀY */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {review.images.map((imgUrl, idx) => {
                            const isVideo = imgUrl.match(/\.(mp4|webm|mov)$/i);
                            return (
                              <div key={idx} onClick={() => setZoomedMedia({ url: imgUrl, type: isVideo ? 'video' : 'image' })} className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition">
                                {isVideo ? (
                                  <video src={imgUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <img src={imgUrl} alt="review-img" className="w-full h-full object-cover" />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      <div className="flex items-center gap-6 mt-4">
                        <button className="text-xs font-medium text-gray-500 hover:text-black flex items-center gap-1.5 transition">
                          <FiThumbsUp size={14} /> Hữu ích
                        </button>

                        {isMyReview && (
                          <>
                            <button onClick={() => handleStartEdit(review)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition">
                              <FiEdit2 size={14} /> Sửa bình luận
                            </button>
                            
                            <button onClick={() => handleDeleteReview(reviewId)} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 transition">
                              <FiTrash2 size={14} /> Xóa
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL PHÓNG TO ẢNH/VIDEO */}
      {zoomedMedia && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setZoomedMedia(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-gray-300 bg-black/50 rounded-full p-2" onClick={() => setZoomedMedia(null)}><FiX size={24} /></button>
          {zoomedMedia.type === 'video' ? (
             <video src={zoomedMedia.url} controls autoPlay className="max-w-full max-h-[90vh] rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          ) : (
             <img src={zoomedMedia.url} alt="Zoomed" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          )}
        </div>
      )}

    </div>
  );
};

export default ProductReviews;