import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { FiSend, FiUser, FiSearch, FiMessageCircle, FiX } from 'react-icons/fi'; // Thêm icon FiX
import { useAuthStore } from '../../store/useAuthStore';

const MessageCenter = () => {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState(null);
  
  // State quản lý dữ liệu
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [currentMsg, setCurrentMsg] = useState("");
  
  // 🌟 TÍNH NĂNG MỚI: Quản lý danh sách các chat bị ẩn (Lấy từ LocalStorage)
  const [hiddenChats, setHiddenChats] = useState(() => {
    const saved = localStorage.getItem('hiddenSellerChats');
    return saved ? JSON.parse(saved) : [];
  });

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, activeChat]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('https://shoppro-backend-k01l.onrender.com/api/messages/conversations', config);
        setConversations(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách khách hàng:", error);
      }
    };

    if (user && user.role === 'seller') {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`https://shoppro-backend-k01l.onrender.com/api/messages/${activeChat.id}`, config);
        
        const roomId = [user._id, activeChat.id].sort().join("_");
        setMessages(prev => ({ ...prev, [roomId]: data }));
      } catch (error) {
        console.error("Lỗi lấy lịch sử cuộc trò chuyện:", error);
      }
    };

    fetchMessages();
  }, [activeChat, user]);

  useEffect(() => {
    if (!user || user.role !== 'seller') return;

    const newSocket = io("https://shoppro-backend-k01l.onrender.com");
    setSocket(newSocket);

    newSocket.emit("join_room", user._id);

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => {
        const roomMsgs = prev[data.roomId] || [];
        return { ...prev, [data.roomId]: [...roomMsgs, data] };
      });

      setConversations((prev) => {
        const isExist = prev.find(c => c.id === data.senderId);
        if (!isExist) {
          return [{ id: data.senderId, name: `Khách hàng mới` }, ...prev];
        }
        return prev;
      });

      // 🌟 TÍNH NĂNG MỚI: Nếu khách hàng đang bị ẩn mà nhắn tin lại -> Gỡ ẩn ngay lập tức
      setHiddenChats(prev => {
        if (prev.includes(data.senderId)) {
          const newHidden = prev.filter(id => id !== data.senderId);
          localStorage.setItem('hiddenSellerChats', JSON.stringify(newHidden));
          return newHidden;
        }
        return prev;
      });
    });

    return () => newSocket.disconnect();
  }, [user]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMsg.trim() === "" || !socket || !activeChat) return;

    const roomId = [user._id, activeChat.id].sort().join("_");
    
    const messageData = {
      roomId: roomId,
      senderId: user._id,
      receiverId: activeChat.id,
      content: currentMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    await socket.emit("send_message", messageData);
    
    setMessages((prev) => {
      const roomMsgs = prev[roomId] || [];
      return { ...prev, [roomId]: [...roomMsgs, messageData] };
    });
    
    setCurrentMsg("");
  };

  const getActiveRoomMessages = () => {
    if (!activeChat) return [];
    const roomId = [user._id, activeChat.id].sort().join("_");
    return messages[roomId] || [];
  };

  // 🌟 TÍNH NĂNG MỚI: Hàm xử lý khi bấm nút X ẩn chat
  const handleHideChat = (e, chatId) => {
    e.stopPropagation(); // Ngăn chặn việc click vào X mà bị dính luôn sự kiện chọn chat
    const newHidden = [...hiddenChats, chatId];
    setHiddenChats(newHidden);
    localStorage.setItem('hiddenSellerChats', JSON.stringify(newHidden)); // Lưu vào bộ nhớ trình duyệt
    
    // Nếu đang mở khung chat của người bị ẩn thì đóng khung chat đó lại
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }
  };

  // Lọc ra những cuộc trò chuyện KHÔNG bị ẩn
  const visibleConversations = conversations.filter(chat => !hiddenChats.includes(chat.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        
        {/* CỘT TRÁI */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-gray-800">Khách hàng</h2>
            <div className="mt-4 relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm cuộc trò chuyện..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto group">
            {visibleConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">Chưa có tin nhắn nào từ khách hàng.</div>
            ) : (
              visibleConversations.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition flex items-center gap-3 relative group/item ${
                    activeChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-100 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    <FiUser size={20} />
                  </div>
                  <div className="flex-1 overflow-hidden pr-6">
                    <h4 className="font-bold text-gray-900 truncate">{chat.name}</h4>
                    <p className="text-sm text-gray-500 truncate">Nhấn để xem tin nhắn...</p>
                  </div>

                  {/* 🌟 NÚT X ĐỂ ẨN TRÒ CHUYỆN (Chỉ hiện khi rê chuột vào) */}
                  <button 
                    onClick={(e) => handleHideChat(e, chat.id)}
                    title="Ẩn cuộc trò chuyện"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CỘT PHẢI: KHUNG CHAT CHI TIẾT (GIỮ NGUYÊN) */}
        <div className="w-2/3 flex flex-col bg-white">
          {activeChat ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center gap-3 shadow-sm z-10">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  <FiUser size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activeChat.name}</h3>
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Đang hoạt động
                  </span>
                </div>
              </div>

              <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto bg-gray-50/50 flex flex-col gap-4">
                {getActiveRoomMessages().map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.senderId === user._id ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                      msg.senderId === user._id 
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-sm' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder="Nhập câu trả lời của bạn..." 
                  className="flex-1 bg-gray-100 px-5 py-3 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={currentMsg}
                  onChange={(e) => setCurrentMsg(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  <FiSend size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <FiMessageCircle size={64} className="mb-4 text-gray-200" />
              <p className="text-lg font-medium text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;