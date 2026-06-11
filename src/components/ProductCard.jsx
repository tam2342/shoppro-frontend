import { Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { useCartStore } from '../store/useCartStore';

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  // Giả lập dữ liệu nếu database chưa có
  const soldCount = product.sold || Math.floor(Math.random() * 1000) + 50; 
  const rating = product.rating || 4.8;

  const handleQuickAdd = (e) => {
    e.preventDefault(); // Rất quan trọng: Ngăn không cho click xuyên qua thẻ Link
    addToCart(product);
    alert(`Đã thêm ${product.name} vào giỏ!`); 
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_10px_20px_rgba(17,202,160,0.15)] transition-all duration-300 relative border border-gray-100/50 group flex flex-col">
      
      {/* KHU VỰC BẤM CHUYỂN TRANG */}
      <Link to={`/product/${product._id}`} className="flex-1 flex flex-col cursor-pointer relative">
        
        {/* 1. Phần hình ảnh với hiệu ứng Hover Overlay */}
        <div className="relative w-full pt-[100%] bg-gray-50 overflow-hidden">
          <img 
            src={product.image || (product.images && product.images[0])} 
            alt={product.name} 
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Badge Giảm giá - Kiểu dáng Gradient hiện đại */}
          {product.oldPrice && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-md z-10">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </div>
          )}

          {/* Lớp Overlay và Nút Thêm giỏ hàng hiện ra khi Hover (Tính năng ăn điểm) */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-3">
            <button 
              onClick={handleQuickAdd}
              className="w-full bg-[#11caa0] hover:bg-[#0eac88] text-white py-2 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
            >
              <FiShoppingCart /> Mua nhanh
            </button>
          </div>
        </div>
        
        {/* 2. Thông tin sản phẩm */}
        <div className="p-3.5 flex-1 flex flex-col justify-between bg-white z-20">
          <div>
            <h3 className="text-sm font-medium text-[#002147] line-clamp-2 leading-relaxed min-h-[2.75rem] group-hover:text-[#11caa0] transition-colors">
              {/* Tag chuẩn ShopPro */}
              <span className="inline-block bg-[#f3f0df] text-[#002147] text-[9px] px-1.5 py-0.5 mr-1.5 rounded uppercase font-bold tracking-wider relative -top-0.5">
                Pro Xtra
              </span>
              {product.name}
            </h3>
          </div>
          
          <div className="mt-3">
            <div className="flex items-center text-[#11caa0] mb-1.5">
              <span className="text-sm font-semibold underline decoration-1 underline-offset-2">đ</span>
              <span className="text-lg font-bold ml-0.5">
                {new Intl.NumberFormat('vi-VN').format(product.price)}
              </span>
            </div>
            
            {/* Thanh đánh giá và Đã bán (Tinh tế hơn) */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="flex items-center bg-yellow-50 px-1.5 py-0.5 rounded text-yellow-500">
                <AiFillStar size={11} />
                <span className="ml-1 text-[10px] font-bold">{rating}</span>
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                Đã bán {soldCount >= 1000 ? `${(soldCount/1000).toFixed(1)}k` : soldCount}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;