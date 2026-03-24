import { FiShoppingCart } from 'react-icons/fi';
// Lùi 1 cấp để ra src, sau đó chui vào store
import { useCartStore } from '../store/useCartStore'; 

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product);
    alert(`Đã thêm ${product.name} vào giỏ!`); 
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer border border-gray-100">
      <div className="relative h-64 overflow-hidden bg-gray-100 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{product.category}</span>
        <h3 className="mt-1 text-lg font-medium text-gray-900 truncate">{product.name}</h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
          </span>
          <button 
            onClick={handleAddToCart}
            className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <FiShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;