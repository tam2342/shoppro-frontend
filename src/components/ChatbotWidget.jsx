import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; // 👉 BỔ SUNG ROUTER
import axios from 'axios';
import { FiMessageSquare, FiX, FiSend, FiCpu, FiExternalLink } from 'react-icons/fi';

const ChatbotWidget = () => {
  const location = useLocation(); // Bắt URL hiện tại
  
  // 👉 1. LOGIC ẨN CHATBOT Ở CÁC TRANG CỤ THỂ
  const hidePaths = ['/login', '/register', '/admin', '/seller'];
  const isProductDetail = location.pathname.startsWith('/product/');
  const isHidden = hidePaths.some(path => location.pathname.startsWith(path)) || isProductDetail;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // 👉 2. LOGIC ĐỔI LỜI CHÀO THEO NGỮ CẢNH TRANG (Chạy 1 lần khi load)
  useEffect(() => {
    let initialGreeting = 'Xin chào! Mình là trợ lý ảo ShopPro. Bạn cần mình tư vấn sản phẩm nào ạ? 😊';
    
    if (location.pathname === '/') {
      initialGreeting = 'Chào bạn! Hôm nay bạn muốn tìm món đồ công nghệ nào trên ShopPro?';
    } else if (location.pathname.startsWith('/search')) {
      initialGreeting = 'Bạn chưa tìm thấy món đồ ưng ý à? Hãy nói khoảng giá hoặc nhu cầu để mình lọc giúp nhé!';
    } else if (location.pathname === '/cart' || location.pathname === '/checkout') {
      initialGreeting = 'Bạn đang ở bước thanh toán. Có cần mình hỗ trợ kiểm tra mã giảm giá hay phí ship không?';
    }

    setMessages([{ sender: 'bot', text: initialGreeting }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Cố tình để [] để nó không reset chat khi khách nhảy trang, giữ liền mạch hội thoại

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Nếu đang ở trang cần ẩn thì không render gì cả
  if (isHidden) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const { data } = await axios.post('https://shoppro-backend-k01l.onrender.com/api/chatbot', {
        message: userMessage,
        // Ép mảng lịch sử chỉ lấy chuỗi text gửi lên AI, bỏ qua cái mảng products đi cho nhẹ
        history: messages.map(m => ({ sender: m.sender, text: m.text })) 
      });

      // 👉 Nhận data có cả text và mảng products từ Backend
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: data.reply,
        products: data.products // Lưu mảng sản phẩm AI gợi ý vào state
      }]);
    } catch (error) {
      console.error("Lỗi chat:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Hệ thống bận một chút, bạn thử lại nhé!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 hover:rotate-12 transition-all duration-300 relative group"
        >
          <FiMessageSquare size={26} />
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full"></span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-[360px] sm:w-[420px] h-[550px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl"><FiCpu size={20} className="animate-pulse" /></div>
              <div>
                <h4 className="font-bold text-sm tracking-wide">ShopPro AI Assistant</h4>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Trực tuyến
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition">
              <FiX size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-slate-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {/* Khối Text Chat */}
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm whitespace-pre-line
                  ${msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}
                >
                  {msg.text}
                </div>

                {/* 👉 Khối hiển thị CARD SẢN PHẨM nếu AI có gợi ý */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 w-[90%] flex flex-col gap-2">
                    {msg.products.map(product => (
                      <Link 
                        to={`/product/${product._id}`} 
                        key={product._id}
                        className="bg-white border border-gray-100 p-2 rounded-xl flex gap-3 items-center hover:shadow-md transition group cursor-pointer"
                      >
                        {/* Lấy ảnh đầu tiên trong mảng images, hoặc trường image tùy schema */}
                        <div className="w-14 h-14 bg-gray-50 rounded-lg shrink-0 overflow-hidden">
                          <img 
                            src={product.image || (product.images && product.images[0]) || '/placeholder.png'} 
                            alt={product.name} 
                            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition duration-300"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">{product.name}</h4>
                          <p className="text-sm font-extrabold text-blue-600 mt-0.5">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                          </p>
                        </div>
                        <div className="pr-2 text-gray-300 group-hover:text-blue-500">
                          <FiExternalLink size={18} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white flex gap-2 items-center z-10">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập yêu cầu tư vấn..."
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="w-11 h-11 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-200 shrink-0"
            >
              <FiSend size={18} className="ml-1" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;