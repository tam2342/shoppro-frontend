import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FiSend, FiX, FiMessageCircle } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

const ChatBox = ({ sellerId, sellerName }) => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState("");
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // --- THÊM ĐOẠN NÀY ĐỂ LẤY LỊCH SỬ CHAT ---
  useEffect(() => {
    // Chỉ lấy lịch sử khi bong bóng chat được mở lên
    if (!isOpen || !user || !sellerId) return;

    const fetchHistory = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Gọi API lấy lịch sử giữa khách (user) và shop (sellerId)
        const { data } = await axios.get(`https://shoppro-backend-k01l.onrender.com/api/messages/${sellerId}`, config);
        setMessages(data);
      } catch (error) {
        console.error("Lỗi lấy lịch sử chat:", error);
      }
    };

    fetchHistory();
  }, [isOpen, user, sellerId]);
  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // KẾT NỐI SOCKET.IO
  useEffect(() => {
    // Nếu chưa đăng nhập hoặc khách đang xem hàng của chính mình thì không hiện chat
    if (!user || user._id === sellerId) return;

    // 1. Cắm ống nước tới Backend
    const newSocket = io("https://shoppro-backend-k01l.onrender.com");
    setSocket(newSocket);

    // 2. Tạo ID Phòng kín (Ghép 2 ID lại và sắp xếp để luôn ra 1 chuỗi duy nhất)
    const roomId = [user._id, sellerId].sort().join("_");
    newSocket.emit("join_room", roomId);

    // 3. Lắng nghe tin nhắn từ đầu dây bên kia
    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Rút ống nước khi chuyển trang
    return () => newSocket.disconnect();
  }, [user, sellerId]);

  // HÀM GỬI TIN NHẮN
  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMsg.trim() === "" || !socket) return;

    const roomId = [user._id, sellerId].sort().join("_");
    
    const messageData = {
      roomId: roomId,
      senderId: user._id,
      receiverId: sellerId,
      content: currentMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Gửi tín hiệu qua ống nước
    await socket.emit("send_message", messageData);
    
    // Hiển thị luôn lên màn hình của mình
    setMessages((prev) => [...prev, messageData]);
    setCurrentMsg("");
  };

  // Ẩn toàn bộ Chat nếu chưa đăng nhập hoặc đang xem hàng của chính mình
  if (!user || user._id === sellerId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Nút Bong Bóng Chat */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all"
        >
          <FiMessageCircle size={28} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce">
            Mới
          </span>
        </button>
      )}

      {/* Cửa Sổ Chat (Hiện khi bấm vào bong bóng) */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up h-[450px]">
          {/* Header Chat */}
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex justify-center items-center font-bold">
                {sellerName?.charAt(0) || 'S'}
              </div>
              <div>
                <h3 className="font-bold text-sm truncate">{sellerName || 'Người bán'}</h3>
                <p className="text-xs text-blue-200">Đang hoạt động</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-500 p-1 rounded-lg transition">
              <FiX size={20} />
            </button>
          </div>

          {/* Khu vực hiển thị tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            <div className="text-center text-xs text-gray-400 mb-2">
              Cuộc trò chuyện được bảo mật
            </div>
            
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.senderId === user._id ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.senderId === user._id 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Khu vực nhập liệu */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Nhập tin nhắn..." 
              className="flex-1 bg-gray-100 px-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={currentMsg}
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition flex-shrink-0">
              <FiSend size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox;