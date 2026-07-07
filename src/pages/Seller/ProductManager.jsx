// src/pages/Seller/ProductManager.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiX, FiUploadCloud, FiCheckCircle, FiTrash } from 'react-icons/fi';
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
    images: []          // ← Đổi thành mảng để hỗ trợ nhiều ảnh
  });

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

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'Điện Thoại & Phụ Kiện',
      countInStock: 10,
      images: []
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category,
      countInStock: product.countInStock,
      images: product.images || []        // ← Lấy toàn bộ mảng ảnh
    });
    setIsModalOpen(true);
  };

  // Upload nhiều ảnh
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls = [];

    try {
      for (let file of files) {
        const uploadData = new FormData();
        uploadData.append('image', file);

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        const { data } = await axios.post(
          'https://shoppro-backend-k01l.onrender.com/api/upload',
          uploadData,
          config
        );

        uploadedUrls.push(data.imageUrl);
      }

      // Thêm ảnh mới vào mảng hiện tại
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

    } catch (error) {
      console.error(error);
      alert('Lỗi tải ảnh lên mây. Vui lòng thử lại!');
    } finally {
      setUploadingImage(false);
    }
  };

  // Xóa một ảnh trong form
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      return alert("Vui lòng tải lên ít nhất 1 hình ảnh cho sản phẩm!");
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      const productData = {
        ...formData,
        brand: "Khác"
      };

      if (editingId) {
        await axios.put(`https://shoppro-backend-k01l.onrender.com/api/products/${editingId}`, productData, config);
        alert("🎉 Cập nhật sản phẩm thành công!");
      } else {
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
        await axios.delete(`https://shoppro-backend-k01l.onrender.com/api/products/${id}`, config);
        fetchMyProducts();
      } catch (error) {
        alert("Xóa thất bại!");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#f5f5f5] min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        {/* HEADER */}
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
          {/* ... bảng giữ nguyên như cũ ... */}
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
                        <img src={product.images?.[0] || 'https://via.placeholder.com/50'} alt="" className="w-full h-full object-cover" />
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

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:bg-gray-100 p-2 rounded-full transition"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
              {editingId ? 'Cập nhật thông tin sản phẩm' : 'Đăng sản phẩm mới'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">

              {/* CỘT TRÁI: KHU VỰC ẢNH */}
              <div className="w-full md:w-2/5 flex flex-col gap-3">
                <label className="font-semibold text-gray-700 text-sm">Hình ảnh sản phẩm <span className="text-red-500">*</span></label>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50 p-6 text-center hover:border-blue-400 transition-colors">
                  <label className="cursor-pointer flex flex-col items-center">
                    <FiUploadCloud size={40} className="text-blue-500 mb-2" />
                    <span className="font-medium text-blue-600">Click để tải nhiều ảnh</span>
                    <span className="text-xs text-gray-400 mt-1">JPG, PNG (có thể chọn nhiều)</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* Preview nhiều ảnh */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`preview-${index}`}
                          className="w-full h-24 object-cover rounded-xl border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <FiTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadingImage && <p className="text-blue-600 text-sm mt-2">Đang tải ảnh lên...</p>}
              </div>

              {/* CỘT PHẢI: FORM */}
              <div className="w-full md:w-3/5 space-y-5">
                {/* Các trường input giữ nguyên như cũ */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên sản phẩm <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Nhập tên sản phẩm..."
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số lượng kho <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      value={formData.countInStock}
                      onChange={(e) => setFormData({ ...formData, countInStock: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Danh mục</label>
                  <select
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Điện Thoại & Phụ Kiện">Điện Thoại & Phụ Kiện</option>
                    <option value="Máy Tính & Laptop">Máy Tính & Laptop</option>
                    <option value="Thời Trang Nam">Thời Trang Nam</option>
                    <option value="Thời Trang Nữ">Thời Trang Nữ</option>
                    <option value="Mẹ & Bé">Mẹ & Bé</option>
                    <option value="Nhà Cửa & Đời Sống">Nhà Cửa & Đời Sống</option>
                    <option value="Sắc Đẹp">Sắc Đẹp</option>
                    <option value="Sức Khỏe">Sức Khỏe</option>
                    <option value="Giày Dép Nam">Giày Dép Nam</option>
                    <option value="Phụ Kiện Nữ">Phụ Kiện Nữ</option>
                    <option value="Đồng Hồ">Đồng Hồ</option>
                    <option value="Thể Thao & Du Lịch">Thể Thao & Du Lịch</option>
                    <option value="Ô Tô & Xe Máy">Ô Tô & Xe Máy</option>
                    <option value="Bách Hóa Online">Bách Hóa Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả sản phẩm</label>
                  <textarea
                    placeholder="Viết mô tả chi tiết..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || uploadingImage || formData.images.length === 0}
                  className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {loading ? "Đang lưu..." : (editingId ? "Lưu thay đổi" : "Đăng bán sản phẩm")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;