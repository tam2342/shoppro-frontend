import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Thêm công cụ lấy ID từ thanh địa chỉ
import axios from 'axios'; // Thêm thư viện gọi API
import { FiShoppingCart, FiHeart, FiShield, FiTruck, FiRotateCcw } from 'react-icons/fi';
import { useCartStore } from '../../store/useCartStore';
import ProductReviews from '../../components/ProductReviews';
import ChatBox from '../../components/ChatBox';

const ProductDetail = () => {
  // 1. LẤY MÃ SẢN PHẨM TRÊN URL (Ví dụ: localhost:5173/product/69bc...)
  const { id } = useParams();
  
  const addToCart = useCartStore((state) => state.addToCart);
  const [selectedColor, setSelectedColor] = useState('titan');
  const [selectedStorage, setSelectedStorage] = useState('256GB');
  const [quantity, setQuantity] = useState(1);

  // 2. STATE ĐỂ LƯU SẢN PHẨM (Ban đầu là null, sẽ chờ API trả về)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  // 3. TẠO "GIỎ CHỨA" ĐỂ LƯU THÔNG TIN CHỦ SHOP THẬT
  const [realSellerId, setRealSellerId] = useState(null);
  const [realSellerName, setRealSellerName] = useState("Đang kết nối...");

  // 4. TỰ ĐỘNG LẤY DỮ LIỆU SẢN PHẨM KHI VÀO TRANG HOẶC CHUYỂN TRANG
  useEffect(() => {
    const fetchRealProduct = async () => {
      try {
        setLoading(true);
        // Đảm bảo không gọi ID = '1' của dữ liệu ảo cũ
        if (id === '1') {
           setLoading(false);
           return;
        }

        const { data } = await axios.get(`https://shoppro-backend-k01l.onrender.com/api/products/${id}`);
        
        // Cập nhật thông tin sản phẩm lên màn hình
        setProduct(data);
        
        // Xử lý ảnh: Nếu trường là images (mảng) thì lấy cái đầu, nếu là image (chuỗi) thì lấy chuỗi
        const initialImg = data.images && data.images.length > 0 
           ? data.images[0] 
           : data.image || 'https://via.placeholder.com/800'; // Ảnh mặc định nếu không có

        setActiveImage(initialImg);

        // Tự động dò tìm chủ shop
        const foundSellerId = data.seller?._id || data.seller || data.user?._id || data.user;
        const foundSellerName = data.seller?.name || data.user?.name || "Shop Bán Hàng";

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
  }, [id]); // 👉 CỰC KỲ QUAN TRỌNG: Phải có chữ 'id' ở đây để đổi trang là load lại data

  const handleAddToCart = () => {
    if (!product) return;

    // Giả lập màu sắc và dung lượng (nếu DB của bạn chưa có 2 trường này)
    const variantName = product.colors ? product.colors.find(c => c.id === selectedColor)?.name : 'Mặc định';

    const itemToAdd = {
      ...product,
      _id: `${product._id}-${selectedColor}-${selectedStorage}`,
      variant: `${selectedStorage} - ${variantName}`,
      image: activeImage
    };
    
    for(let i = 0; i < quantity; i++) {
      addToCart(itemToAdd);
    }
    alert('Đã thêm vào giỏ hàng thành công!');
  };

  // NẾU ĐANG TẢI DỮ LIỆU
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold">Đang tải dữ liệu sản phẩm...</div>;
  }

  // NẾU KHÔNG TÌM THẤY SẢN PHẨM
  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">Không tìm thấy sản phẩm!</div>;
  }

  // Xử lý an toàn cho mảng ảnh (vì DB của bạn có lúc lưu image, có lúc lưu images)
  const displayImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  // Xử lý an toàn cho dữ liệu giả lập (màu sắc, dung lượng) nếu DB chưa có
  const mockColors = product.colors || [
    { id: 'titan', name: 'Mặc định', hex: '#B8B3A9' }
  ];
  const mockStorage = product.storage || ['256GB'];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center"><a href="/" className="hover:text-blue-600">Trang chủ</a><span className="mx-2">/</span></li>
            <li className="flex items-center"><a href={`/category/${product.category}`} className="hover:text-blue-600">{product.category || 'Sản phẩm'}</a><span className="mx-2">/</span></li>
            <li className="flex items-center text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Cột trái: Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-24 flex-shrink-0 hide-scrollbar">
              {displayImages.map((img, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img ? 'border-blue-600' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="w-full aspect-square bg-gray-50 rounded-3xl overflow-hidden relative flex items-center justify-center border border-gray-100">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              {product.oldPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </div>
              )}
            </div>
          </div>

          {/* Cột phải: Product Info */}
          <div className="mt-10 lg:mt-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
            
            <div className="mt-4 flex items-end gap-4">
              <span className="text-3xl font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </span>
              {product.oldPrice && (
                 <span className="text-lg text-gray-400 line-through mb-1">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.oldPrice)}
                 </span>
              )}
            </div>

            <p className="mt-6 text-base text-gray-600 leading-relaxed">{product.description}</p>

            {/* Variants */}
            <div className="mt-8 border-t border-gray-100 pt-8">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Dung lượng</h3>
                <div className="grid grid-cols-3 gap-3">
                  {mockStorage.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStorage(st)}
                      className={`py-3 text-sm font-semibold rounded-xl border-2 transition-all ${selectedStorage === st ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Màu sắc: <span className="text-gray-500 font-normal">{mockColors.find(c => c.id === selectedColor)?.name}</span></h3>
                <div className="flex space-x-3">
                  {mockColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${selectedColor === color.id ? 'border-blue-600 scale-110' : 'border-transparent hover:scale-105'}`}
                    >
                      <span className="w-9 h-9 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: color.hex }}></span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 text-gray-500 hover:text-blue-600 transition">-</button>
                <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.countInStock || 100, quantity + 1))} className="px-5 text-gray-500 hover:text-blue-600 transition">+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className={`flex-1 h-14 rounded-xl font-bold text-lg shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] hover:shadow-lg transition-all flex items-center justify-center gap-2 ${product.countInStock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                <FiShoppingCart size={22} />
                {product.countInStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </button>

              <button className="w-14 h-14 flex items-center justify-center border-2 border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500 transition bg-white">
                <FiHeart size={24} />
              </button>
            </div>

            {/* Feature list */}
            <ul className="mt-10 space-y-4 text-sm text-gray-600 border-t border-gray-100 pt-8">
              <li className="flex items-center"><FiShield className="text-blue-500 mr-3" size={20}/> Bảo hành chính hãng 12 tháng</li>
              <li className="flex items-center"><FiTruck className="text-blue-500 mr-3" size={20}/> Miễn phí vận chuyển toàn quốc</li>
              <li className="flex items-center"><FiRotateCcw className="text-blue-500 mr-3" size={20}/> Đổi trả miễn phí trong 30 ngày</li>
            </ul>
          </div>
        </div>
        <ProductReviews />
      </div>
      
    {/* 4. CHỈ HIỆN KHUNG CHAT NẾU TÌM THẤY CHỦ SHOP THẬT */}
      {realSellerId && (
        <ChatBox sellerId={realSellerId} sellerName={realSellerName} />
      )}
    </div>
  );
};

export default ProductDetail;