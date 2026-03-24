import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiX } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

const ProductManager = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // STATE MỚI: Lưu ID của sản phẩm đang được sửa (Nếu null là đang Thêm mới)
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', price: '', description: '', category: 'Điện thoại', countInStock: 10, images: ''
  });

  // Lấy danh sách sản phẩm
  const fetchMyProducts = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('https://shoppro-backend-k01l.onrender.com/api/products/myproducts', config);
      setProducts(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
    }
  };

  useEffect(() => { fetchMyProducts(); }, []);

  // HÀM MỞ MODAL THÊM MỚI (Làm sạch Form)
  const handleAddNew = () => {
    setEditingId(null); // Báo hiệu đây là Thêm mới
    setFormData({ name: '', price: '', description: '', category: 'Điện thoại', countInStock: 10, images: '' });
    setIsModalOpen(true);
  };

  // HÀM MỞ MODAL SỬA (Đổ dữ liệu cũ vào Form)
  const handleEdit = (product) => {
    setEditingId(product._id); // Lưu lại ID để biết đang sửa món nào
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      countInStock: product.countInStock,
      images: product.images[0] || '' // Lấy link ảnh đầu tiên
    });
    setIsModalOpen(true);
  };

  // HÀM GỬI DỮ LIỆU (Xử lý cả Thêm và Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const productData = { ...formData, images: [formData.images] };

      if (editingId) {
        // NẾU CÓ editingId -> GỌI API SỬA (PUT)
        await axios.put(`https://shoppro-backend-k01l.onrender.com/api/products/${editingId}`, productData, config);
        alert("🎉 Cập nhật sản phẩm thành công!");
      } else {
        // NẾU KHÔNG CÓ -> GỌI API THÊM MỚI (POST)
        await axios.post('https://shoppro-backend-k01l.onrender.com/api/products', productData, config);
        alert("🎉 Thêm sản phẩm thành công!");
      }

      setIsModalOpen(false);
      fetchMyProducts(); // Load lại bảng
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    } finally { 
      setLoading(false); 
    }
  };

  // Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`https://shoppro-backend-k01l.onrender.com/api/products/${id}`, config);
        fetchMyProducts();
      } catch (error) { alert("Xóa thất bại!"); }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiPackage className="text-blue-600" /> Quản lý sản phẩm của Shop
          </h1>
          {/* NÚT THÊM MỚI NỐI VỚI HÀM handleAddNew */}
          <button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition"
          >
            <FiPlus /> Thêm sản phẩm mới
          </button>
        </div>

        {/* Bảng danh sách sản phẩm */}
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto border border-gray-100">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700">Sản phẩm</th>
                <th className="px-6 py-4 font-bold text-gray-700">Danh mục</th>
                <th className="px-6 py-4 font-bold text-gray-700">Giá</th>
                <th className="px-6 py-4 font-bold text-gray-700">Kho</th>
                <th className="px-6 py-4 font-bold text-gray-700 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={product.images[0] || 'https://via.placeholder.com/50'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{product.price.toLocaleString()}đ</td>
                  <td className="px-6 py-4 text-gray-600">{product.countInStock}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      {/* NÚT SỬA NỐI VỚI HÀM handleEdit */}
                      <button 
                        onClick={() => handleEdit(product)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Sửa sản phẩm"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Xóa sản phẩm"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-10 text-gray-500">Chưa có sản phẩm nào.</div>
          )}
        </div>
      </div>

      {/* MODAL THÊM/SỬA SẢN PHẨM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-fade-in-up">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FiX size={24}/></button>
            
            {/* Đổi tiêu đề Modal dựa vào việc có editingId hay không */}
            <h2 className="text-xl font-bold mb-6">
              {editingId ? 'Cập nhật sản phẩm' : 'Đăng sản phẩm mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Tên sản phẩm" required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Giá (VNĐ)" required min="0" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                <input type="number" placeholder="Số lượng kho" required min="0" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} />
              </div>
              <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Điện thoại">Điện thoại</option>
                <option value="Laptop">Laptop</option>
                <option value="Phụ kiện">Phụ kiện</option>
                <option value="Tablet">Tablet</option>
                <option value="Smartwatch">Smartwatch</option>
              </select>
              <input type="text" placeholder="Link hình ảnh (URL)" required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.images} onChange={(e) => setFormData({...formData, images: e.target.value})} />
              <textarea placeholder="Mô tả sản phẩm" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                {/* Đổi chữ của Nút submit */}
                {loading ? "Đang xử lý..." : (editingId ? "Lưu thay đổi" : "Xác nhận đăng bán")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;