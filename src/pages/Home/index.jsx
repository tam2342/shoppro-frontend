import { useState, useEffect } from 'react';
import axios from 'axios';
import HeroSlider from '../../components/HeroSlider';
import TrustBadges from '../../components/TrustBadges';
import CategoryShowcase from '../../components/CategoryShowcase';
import ProductCard from '../../components/ProductCard';

const Home = () => {
  // 1. Tạo State để lưu sản phẩm thật từ Database
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Hàm gọi API lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('https://shoppro-backend-k01l.onrender.com/api/products');
        
        // Map lại dữ liệu để khớp với ProductCard (vì database dùng images là mảng)
        const formattedData = data.map(p => ({
          ...p,
          image: p.images[0] // ProductCard của bạn đang dùng trường 'image' (số ít)
        }));

        setProducts(formattedData);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm thật:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-50 pb-12">
      <HeroSlider />
      <TrustBadges />
      <CategoryShowcase />

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
              Sản phẩm mới nhất
            </h2>
            <p className="text-gray-500 mt-2">Dữ liệu được cập nhật trực tiếp từ kho hàng</p>
          </div>
          <button className="text-blue-600 font-bold hover:underline">Xem tất cả</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Hiệu ứng loading giả lập khi đợi API */}
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Đổ dữ liệu thật từ Database ra đây */}
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">
                Chưa có sản phẩm nào. Hãy dùng tài khoản Seller để đăng bán ngay!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;