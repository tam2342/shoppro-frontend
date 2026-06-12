import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiHeart, FiShield, FiTruck, FiRotateCcw, FiChevronRight, FiCheck } from 'react-icons/fi';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import ProductReviews from '../../components/ProductReviews';
import ChatBox from '../../components/ChatBox';

const ProductDetail = () => {
  const { id } = useParams();
  
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  
  const [selectedColor, setSelectedColor] = useState('titan');
  const [selectedStorage, setSelectedStorage] = useState('256GB');
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  const [realSellerId, setRealSellerId] = useState(null);
  const [realSellerName, setRealSellerName] = useState("Đang kết nối...");

  useEffect(() => {
    const fetchRealProduct = async () => {
      try {
        setLoading(true);
        if (id === '1') {
           setLoading(false);
           return;
        }

        const { data } = await axios.get(`https://shoppro-backend-k01l.onrender.com/api/products/${id}`);
        setProduct(data);
        
        const initialImg = data.images && data.images.length > 0 
           ? data.images[0] 
           : data.image || 'https://via.placeholder.com/800'; 

        setActiveImage(initialImg);

        const foundSellerId = data.seller?._id || data.seller || data.user?._id || data.user;
        const foundSellerName = data.seller?.name || data.user?.name || "Premium Store";

        if (foundSellerId) {
          setRealSellerId(foundSellerId);
          setRealSellerName(foundSellerName);
        }
      } catch (error) {
        console.log("❌ Lỗi gọi API chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRealProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const variantName = product.colors ? product.colors.find(c => c.id === selectedColor)?.name : 'Standard';
    const itemToAdd = {
      ...product,
      _id: `${product._id}-${selectedColor}-${selectedStorage}`,
      variant: `${selectedStorage} - ${variantName}`,
      image: activeImage
    };
    
    for(let i = 0; i < quantity; i++) {
      addToCart(itemToAdd);
    }
    alert('Đã thêm vào giỏ hàng.');
  };

  const handleToggleWishlist = () => {
    if (product) toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
           <p className="text-sm text-gray-400 font-medium tracking-widest uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl font-light text-gray-900 mb-4">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
          <Link to="/" className="text-sm font-semibold text-black underline underline-offset-4 hover:text-gray-600 transition">Trở về Trang chủ</Link>
        </div>
      </div>
    );
  }

  const displayImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
  const mockColors = product.colors || [{ id: 'titan', name: 'Titan Tự nhiên', hex: '#B8B3A9' }, { id: 'black', name: 'Đen Không gian', hex: '#242424' }];
  const mockStorage = product.storage || ['256GB', '512GB', '1TB'];
  const isWished = isInWishlist(product._id);

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Breadcrumb Minimal */}
        <nav className="text-xs font-medium tracking-wide text-gray-400 mb-12 flex items-center gap-2 uppercase">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <FiChevronRight size={12} />
          <Link to={`/category/${product.category}`} className="hover:text-black transition-colors">{product.category || 'Collection'}</Link>
          <FiChevronRight size={12} />
          <span className="text-black truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-12 lg:gap-16 xl:gap-24">
          
          {/* ================= CỘT TRÁI: HÌNH ẢNH ================= */}
          {/* ================= CỘT TRÁI: HÌNH ẢNH ================= */}
<div className="lg:col-span-7 flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
            <div className="w-full aspect-[4/3] sm:aspect-square bg-[#f9f9fb] rounded-2xl flex items-center justify-center p-8 lg:p-16 relative overflow-hidden group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ease-in-out group-hover:scale-105" 
              />
              {/* Badge Luxury */}
              {product.oldPrice && (
                <div className="absolute top-6 left-6 bg-black text-white px-3 py-1 rounded text-xs font-bold tracking-widest uppercase">
                  Sale -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </div>
              )}
            </div>

            {/* Thumbnail list */}
            <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2">
              {displayImages.map((img, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl bg-[#f9f9fb] overflow-hidden flex-shrink-0 transition-all duration-300 ${activeImage === img ? 'ring-1 ring-black ring-offset-2' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumb ${index}`} className="w-full h-full object-cover mix-blend-multiply p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* ================= CỘT PHẢI: THÔNG TIN ================= */}
          <div className="lg:col-span-5 mt-12 lg:mt-0 flex flex-col">
            
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-[1.1] mb-4">
                {product.name}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                {product.description?.substring(0, 150)}...
              </p>
            </div>
            
            {/* Giá tiền */}
            <div className="flex items-baseline gap-4 mb-10 pb-10 border-b border-gray-100">
              <span className="text-3xl font-medium text-black">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </span>
              {product.oldPrice && (
                 <span className="text-lg text-gray-400 line-through">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.oldPrice)}
                 </span>
              )}
            </div>

            {/* Tùy chọn Dung lượng */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-semibold text-black uppercase tracking-wider">Storage</h3>
                 <span className="text-xs text-blue-600 font-medium hover:underline cursor-pointer">Hướng dẫn chọn dung lượng</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {mockStorage.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStorage(st)}
                    className={`py-4 text-sm font-medium rounded-xl border transition-all duration-200 ${
                      selectedStorage === st 
                      ? 'border-black text-black ring-1 ring-black' 
                      : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Tùy chọn Màu sắc */}
            <div className="mb-10">
              <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4 flex gap-2 items-center">
                Color <span className="text-gray-400 font-normal">|</span> <span className="capitalize">{mockColors.find(c => c.id === selectedColor)?.name}</span>
              </h3>
              <div className="flex space-x-4">
                {mockColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      selectedColor === color.id ? 'ring-2 ring-black ring-offset-4' : 'hover:scale-110'
                    }`}
                  >
                    <span className="w-10 h-10 rounded-full border border-gray-200 shadow-inner" style={{ backgroundColor: color.hex }}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hành động (Giỏ hàng & Yêu thích) */}
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex gap-4">
                {/* Chọn số lượng */}
                <div className="flex items-center justify-between border border-gray-300 rounded-xl h-14 w-32 px-1">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition text-lg">-</button>
                  <span className="font-medium text-black">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.countInStock || 10, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition text-lg">+</button>
                </div>
                
                {/* Nút Thêm Giỏ Hàng */}
                <button 
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className={`flex-1 h-14 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                    product.countInStock === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-900 active:scale-[0.98]'
                  }`}
                >
                  {product.countInStock === 0 ? 'Out of Stock' : 'Add to Bag'}
                </button>
                
                {/* Nút Tim */}
                <button 
                  onClick={handleToggleWishlist}
                  className={`w-14 h-14 flex items-center justify-center border rounded-xl transition-all duration-300 active:scale-95 ${
                    isWished 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-300 text-gray-500 hover:border-black hover:text-black'
                  }`}
                  title={isWished ? "Remove from wishlist" : "Save for later"}
                >
                  <FiHeart size={22} className={isWished ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            {/* Cam kết mua hàng */}
            <div className="border-t border-gray-100 pt-8 mt-auto">
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex items-start gap-3">
                  <FiShield className="text-black flex-shrink-0 mt-0.5" size={18}/> 
                  <span><b className="text-black">Premium Warranty.</b> Bảo hành chính hãng toàn cầu 12 tháng.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiTruck className="text-black flex-shrink-0 mt-0.5" size={18}/> 
                  <span><b className="text-black">Express Delivery.</b> Giao hàng hỏa tốc miễn phí tận nơi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <FiRotateCcw className="text-black flex-shrink-0 mt-0.5" size={18}/> 
                  <span><b className="text-black">Easy Returns.</b> Đổi trả miễn phí trong 30 ngày.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* 👉 KHU VỰC COMMENT/REVIEW ĐÃ ĐƯỢC THU HẸP KHOẢNG CÁCH VÀ CĂN CHỈNH LẠI 👈 */}
        <div className="mt-12 pt-8">
          <div className="max-w-6xl mx-auto">
            <ProductReviews />
          </div>
        </div>

      </div>
      
      {/* Khung Chat Shop */}
      {realSellerId && (
        <ChatBox sellerId={realSellerId} sellerName={realSellerName} />
      )}
    </div>
  );
};

export default ProductDetail;