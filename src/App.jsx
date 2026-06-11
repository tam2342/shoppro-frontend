import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/ScrollToTop';

// 1. Import các trang mua sắm
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import SearchPage from './pages/SearchPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderDetails from './pages/OrderDetails';
import VNPayReturn from './pages/Checkout/VNPayReturn'; 
import BrandDetail from './pages/BrandDetail'; // 👉 BỔ SUNG IMPORT TRANG THƯƠNG HIỆU TẠI ĐÂY

// 2. Import các trang Xác thực và Người dùng
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// 3. Import trang Quản lý dành cho Người bán (Tất cả nằm trong src/pages/Seller)
import SellerLayout from './pages/Seller/SellerLayout';
import SellerDashboard from './pages/Seller/SellerDashboard'; 
import SellerOrderList from './pages/Seller/SellerOrderList';
import ProductManager from './pages/Seller/ProductManager';
import MessageCenter from './pages/Seller/MessageCenter';

// 👉 ĐÃ BỔ SUNG: Import ChatbotWidget (Sửa lại đường dẫn nếu ông lưu file chatbot ở thư mục khác nhé)
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ==========================================
            NHÓM 1: CÁC TRANG KHÔNG CÓ HEADER/FOOTER
        ========================================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ==========================================
            NHÓM 2: TRANG KHÁCH HÀNG (CÓ MAIN LAYOUT)
        ========================================== */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Trang chủ */}
          <Route index element={<Home />} />
          
          {/* Luồng mua sắm */}
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="search" element={<SearchPage />} /> 
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment/vnpay-return" element={<VNPayReturn />} /> 
          <Route path="order/:id" element={<OrderDetails />} />
          
          {/* 👉 BỔ SUNG ROUTE THƯƠNG HIỆU (Nhận tham số :id linh hoạt) */}
          <Route path="brand/:id" element={<BrandDetail />} />
          
          {/* Quản lý tài khoản cá nhân */}
          <Route path="profile" element={<Profile />} />

          {/* Xử lý trang 404 Not Found (Cho giao diện khách) */}
          <Route path="*" element={
            <div className="py-32 text-center text-2xl font-bold text-gray-500">
              404 - Không tìm thấy trang
            </div>
          } />
        </Route>

        {/* ==========================================
            NHÓM 3: KÊNH NGƯỜI BÁN (SELLER DASHBOARD)
        ========================================== */}
        <Route path="/seller" element={<SellerLayout />}>
          {/* Khi truy cập /seller, tự động chuyển hướng vào Dashboard thay vì Đơn hàng */}
          <Route index element={<Navigate to="/seller/dashboard" replace />} />
          
          <Route path="dashboard" element={<SellerDashboard />} /> 
          <Route path="orders" element={<SellerOrderList />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="messages" element={<MessageCenter />} />
          
          {/* <Route path="settings" element={<SellerSettings />} /> */}
        </Route>

      </Routes>

      {/* 👉 ĐÃ BỔ SUNG: Khởi tạo Chatbot toàn cục trôi nổi trên toàn hệ thống web */}
      <ChatbotWidget />
      
    </BrowserRouter>
  );
}

export default App;