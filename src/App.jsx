import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/ScrollToTop';

// 1. Import các trang mua sắm
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderDetails from './pages/OrderDetails';
import VNPayReturn from './pages/Checkout/VNPayReturn'; // 👉 ĐÃ THÊM IMPORT TRANG KẾT QUẢ VNPAY

// 2. Import các trang Xác thực và Người dùng
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// 3. Import trang Quản lý dành cho Người bán
import ProductManager from './pages/Seller/ProductManager';
import MessageCenter from './pages/Seller/MessageCenter';

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
            NHÓM 2: TRANG CÓ HEADER/FOOTER
        ========================================== */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Trang chủ */}
          <Route index element={<Home />} />
          
          {/* Luồng mua sắm */}
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment/vnpay-return" element={<VNPayReturn />} /> {/* 👉 ĐÃ THÊM ĐƯỜNG DẪN HỨNG VNPAY VÀO ĐÂY */}
          <Route path="order/:id" element={<OrderDetails />} />
          
          {/* Quản lý tài khoản cá nhân */}
          <Route path="profile" element={<Profile />} />

          {/* Trang Quản lý sản phẩm (Kênh Người Bán) */}
          <Route path="seller/products" element={<ProductManager />} />
          <Route path="seller/messages" element={<MessageCenter />} />
          
          {/* Xử lý trang 404 Not Found */}
          <Route path="*" element={
            <div className="py-32 text-center text-2xl font-bold text-gray-500">
              404 - Không tìm thấy trang
            </div>
          } />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;