import { useWishlistStore } from '../store/useWishlistStore';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCartStore } from '../store/useCartStore';

const UserWishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (product) => {
    const itemToAdd = { ...product, qty: 1 };
    addToCart(itemToAdd);
    alert('Đã thêm vào giỏ hàng!');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          <FiHeart className="text-red-500 fill-current" /> Sản phẩm yêu thích
        </h2>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {wishlist.length} sản phẩm
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-300 mb-4">
            <FiHeart size={32} />
          </div>
          <p className="text-gray-500 font-medium mb-4">Danh sách yêu thích của bạn đang trống.</p>
          <Link to="/" className="px-6 py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {wishlist.map((product) => (
            <div key={product._id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:bg-gray-50 transition">
              <Link to={`/product/${product._id}`} className="w-24 h-24 sm:w-20 sm:h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group">
                <img src={product.images?.[0] || product.image || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition duration-500" />
              </Link>
              <div className="flex-1">
                <Link to={`/product/${product._id}`} className="font-bold text-gray-900 hover:text-blue-600 line-clamp-1 mb-1">{product.name}</Link>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</span>
                  {product.oldPrice && <span className="text-sm text-gray-400 line-through">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.oldPrice)}</span>}
                </div>
                <p className={`text-xs font-bold mt-2 ${product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}`}>{product.countInStock > 0 ? 'Còn hàng' : 'Hết hàng'}</p>
              </div>
              <div className="w-full sm:w-auto flex sm:flex-col gap-2 justify-end border-t sm:border-0 pt-4 sm:pt-0 border-gray-100">
                <button onClick={() => handleAddToCart(product)} disabled={product.countInStock === 0} className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition ${product.countInStock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}>
                  <FiShoppingCart /> Mua ngay
                </button>
                <button onClick={() => removeFromWishlist(product._id)} className="px-4 py-2 text-sm font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-2 transition">
                  <FiTrash2 /> Bỏ thích
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserWishlist;