// src/pages/Seller/ProductManager.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiX, FiUploadCloud, FiCheckCircle } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

const ProductManager = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', 
    price: '', 
    description: '', 
    category: 'Điện Thoại & Phụ Kiện', 
    countInStock: 10, 
    images: ''
  });

  const fetchMyProducts = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Thay đổi URL API về localhost
      const { data } = await axios.get('https://shoppro-backend-k01l.onrender.com/api/products/myproducts', config);
      setProducts(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách sản phẩm:", error);
    }
  };

  useEffect(() => { fetchMyProducts(); }, []);

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', description: '', category: 'Điện Thoại & Phụ Kiện', countInStock: 10, images: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      countInStock: product.countInStock,
      images: product.images[0] || '' 
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploadingImage(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      // Thay đổi URL API về localhost
      const { data } = await axios.post('https://shoppro-backend-k01l.onrender.com/api/upload', uploadData, config);
      
      setFormData({ ...formData, images: data.imageUrl });
    } catch (error) {
      console.error(error);
      alert('Lỗi tải ảnh lên mây. Vui lòng thử lại!');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.images) {
      return alert("Vui lòng tải lên ít nhất 1 hình ảnh cho sản phẩm!");
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const productData = { 
  ...formData, 
  images: [formData.images],
  brand: "Khác" // 👉 THÊM DÒNG NÀY ĐỂ BÙ ĐẮP DỮ LIỆU CÒN THIẾU CHO BACKEND
};

      if (editingId) {
        // Thay đổi URL API về localhost
        await axios.put(`https://shoppro-backend-k01l.onrender.com/api/products/${editingId}`, productData, config);
        alert("🎉 Cập nhật sản phẩm thành công!");
      } else {
        // Thay đổi URL API về localhost
        await axios.post('https://shoppro-backend-k01l.onrender.com/api/products', productData, config);
        alert("🎉 Thêm sản phẩm thành công!");
      }

      setIsModalOpen(false);
      fetchMyProducts(); 
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.message || error.message));
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi cửa hàng?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Thay đổi URL API về localhost
        await axios.delete(`https://shoppro-backend-k01l.onrender.com/api/products/${id}`, config);
        fetchMyProducts();
      } catch (error) { alert("Xóa thất bại!"); }
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f5f5f5] min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        {/* HEADER QUẢN LÝ */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
              <span className="p-2 bg-blue-100 text-blue-600 rounded-lg"><FiPackage /></span>
              Sản phẩm của tôi
            </h1>
            <p className="text-gray-500 text-sm mt-1">Quản lý kho hàng, giá cả và thông tin chi tiết</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-md shadow-blue-200 transition-all hover:-translate-y-0.5"
          >
            <FiPlus size={20} /> Thêm sản phẩm mới
          </button>
        </div>

        {/* BẢNG SẢN PHẨM */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50/80 border-b border-gray-100 uppercase text-xs tracking-wider text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Tên Sản Phẩm</th>
                  <th className="px-6 py-4">Danh mục</th>
                  <th className="px-6 py-4">Giá bán</th>
                  <th className="px-6 py-4">Kho hàng</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl border border-gray-100 overflow-hidden bg-white shrink-0 shadow-sm">
                        <img src={product.images[0] || 'https://via.placeholder.com/50'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-gray-800 line-clamp-2 max-w-[250px]">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      <span className="px-3 py-1 bg-gray-100 rounded-full">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600 text-base">
                      {product.price.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.countInStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.countInStock > 0 ? `Còn ${product.countInStock}` : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors" title="Sửa sản phẩm"><FiEdit2 /></button>
                        <button onClick={() => handleDelete(product._id)} className="p-2.5 text-red-500 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-colors" title="Xóa sản phẩm"><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="text-center py-16 flex flex-col items-center justify-center text-gray-500">
              <FiPackage size={48} className="text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600">Kho hàng của bạn đang trống</p>
              <p className="text-sm mt-1">Hãy đăng bán sản phẩm đầu tiên ngay hôm nay!</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL GIAO DIỆN MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 md:p-8 relative shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:bg-gray-100 p-2 rounded-full transition"><FiX size={24}/></button>
            
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
              {editingId ? 'Cập nhật thông tin sản phẩm' : 'Đăng sản phẩm mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
              
              {/* CỘT TRÁI: KHU VỰC TẢI ẢNH */}
              <div className="w-full md:w-1/3 flex flex-col gap-3">
                <label className="font-semibold text-gray-700 text-sm">Hình ảnh sản phẩm <span className="text-red-500">*</span></label>
                
                <div className="relative w-full aspect-square border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-400 transition-colors">
                  {formData.images ? (
                    <>
                      <img src={formData.images} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-gray-50 transition">
                          Đổi ảnh khác
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      {uploadingImage ? (
                        <div className="flex flex-col items-center text-blue-600">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                          <span className="font-medium">Đang tải lên...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 mb-3 shadow-sm">
                            <FiUploadCloud size={24} />
                          </div>
                          <span className="text-blue-600 font-semibold mb-1">Click để tải ảnh lên</span>
                          <span className="text-xs text-gray-400">Hỗ trợ JPG, PNG</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  )}
                </div>
                {formData.images && <p className="text-xs text-green-600 font-medium flex items-center gap-1"><FiCheckCircle /> Đã tải ảnh thành công</p>}
              </div>

              {/* CỘT PHẢI: NHẬP THÔNG TIN */}
              <div className="w-full md:w-2/3 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên sản phẩm <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Nhập tên sản phẩm (VD: Áo thun nam Polo...)" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="0" required min="0" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số lượng kho <span className="text-red-500">*</span></label>
                    <input type="number" placeholder="0" required min="0" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.countInStock} onChange={(e) => setFormData({...formData, countInStock: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Danh mục ngành hàng <span className="text-red-500">*</span></label>
                  <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer transition-all" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Điện Thoại & Phụ Kiện">Điện Thoại & Phụ Kiện</option>
                    <option value="Máy Tính & Laptop">Máy Tính & Laptop</option>
                    <option value="Thời Trang Nam">Thời Trang Nam</option>
                    <option value="Thời Trang Nữ">Thời Trang Nữ</option>
                    <option value="Mẹ & Bé">Mẹ & Bé</option>
                    <option value="Nhà Cửa & Đời Sống">Nhà Cửa & Đời Sống</option>
                    <option value="Sắc Đẹp">Sắc Đẹp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả sản phẩm</label>
                  <textarea placeholder="Viết mô tả chi tiết để khách hàng dễ dàng đưa ra quyết định mua hàng..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] transition-all resize-y" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={loading || uploadingImage} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none">
                    {loading ? "Đang lưu dữ liệu..." : (editingId ? "Lưu lại thay đổi" : "Hoàn tất đăng bán")}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;