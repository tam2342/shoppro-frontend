import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { FiDollarSign, FiShoppingBag, FiTrendingUp, FiMapPin, FiActivity, FiPackage, FiLayers, FiArrowUpRight, FiInfo } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const SellerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = useAuthStore((state) => state.user);
  const token = user?.token || useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.get('https://shoppro-backend-k01l.onrender.com/api/orders/seller/stats', config);
      
      console.log("🛠️ Dữ liệu API trả về:", data); // Để ông F12 check xem backend có gửi totalStock không nhé

      const formattedBranchData = (data.branchStats || []).map(item => ({
        name: item._id || 'Chi nhánh chính',
        "Doanh Thu": item.totalRevenue,
        "Số Đơn": item.orderCount
      }));

      const formattedRegionData = (data.regionStats || []).map(item => ({
        name: item._id || 'Khác',
        value: item.totalRevenue,
      }));

      // 👉 ĐÃ FIX: Quét tìm totalStock an toàn dù backend để ở đâu, nếu không có thì mặc định bằng 0
      const safeTotalStock = data?.overview?.totalStock ?? data?.totalStock ?? 0;

      setStats({
        overview: {
          totalRevenue: data?.overview?.totalRevenue || 0,
          totalOrders: data?.overview?.totalOrders || 0,
          totalStock: safeTotalStock
        },
        branchData: formattedBranchData,
        regionData: formattedRegionData
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="p-10 text-center bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiInfo size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa xác thực</h3>
          <p className="text-gray-500 mb-8">Vui lòng đăng nhập để truy cập vào hệ thống báo cáo quản trị.</p>
          <Link to="/login" className="block w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-500 font-medium animate-pulse text-lg">Đang tổng hợp dữ liệu kinh doanh...</p>
    </div>
  );

  if (error) return (
    <div className="p-8 mt-8 bg-red-50 border border-red-100 rounded-3xl text-center">
      <p className="text-red-500 font-bold text-lg">Lỗi: {error}</p>
    </div>
  );

  if (!stats) return null;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-[#f8fafc] min-h-screen font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tổng quan Kinh doanh</h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">Phân tích hiệu suất bán hàng dựa trên các đơn hàng <strong className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md">Đã giao thành công</strong>.</p>
        </div>
        <button className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md flex items-center gap-2">
          <FiActivity /> Cập nhật ngay
        </button>
      </div>

      {/* KPI CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Doanh Thu */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
            <FiDollarSign />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Tổng Doanh Thu</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.overview.totalRevenue)}
            </h3>
          </div>
        </div>

        {/* Card Số Đơn Hàng */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
            <FiShoppingBag />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Đơn thành công</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {stats.overview.totalOrders || 0} <span className="text-lg font-medium text-gray-400 ml-1">đơn</span>
            </h3>
          </div>
        </div>
        
        {/* Card Tồn Kho */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
            <FiPackage />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Tổng Tồn Kho</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {new Intl.NumberFormat('vi-VN').format(stats.overview.totalStock)} <span className="text-lg font-medium text-gray-400 ml-1">sp</span>
            </h3>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        {/* Biểu đồ Cột */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FiTrendingUp size={20} /></span>
              Doanh thu theo Chi nhánh
            </h3>
          </div>
          <div className="flex-1 min-h-[350px] w-full">
            {stats.branchData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.branchData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={15} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}}
                    tickFormatter={(value) => `${value >= 1000000 ? (value / 1000000) + 'M' : value}`} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '30px' }} iconType="circle" />
                  <Bar dataKey="Doanh Thu" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={50} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                Chưa có dữ liệu giao dịch
              </div>
            )}
          </div>
        </div>

        {/* Biểu đồ Tròn */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <span className="p-2 bg-rose-50 text-rose-500 rounded-lg"><FiMapPin size={20} /></span>
              Tỷ trọng Doanh thu Khu vực
            </h3>
          </div>
          <div className="flex-1 min-h-[350px] w-full relative">
            {stats.regionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    paddingAngle={6}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                    animationDuration={1500}
                  >
                    {stats.regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                Chưa có dữ liệu phân bổ
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ANALYSIS SECTION */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-8 sm:p-10 rounded-3xl text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mt-8">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-start sm:items-center gap-6 relative z-10">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shrink-0">
            <FiLayers size={36} className="text-blue-300" />
          </div>
          <div>
            <h4 className="text-2xl font-black tracking-tight mb-2">Phân tích chuyên sâu</h4>
            <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
              Dựa trên dữ liệu thực tế, hệ thống ghi nhận xu hướng tăng trưởng ổn định tại khu vực <strong className="text-white border-b border-blue-400 pb-0.5">{stats.regionData[0]?.name || 'trung tâm'}</strong>. Bạn có thể triển khai thêm chiến dịch Flash Sale tại đây để bứt phá doanh số.
            </p>
          </div>
        </div>
        <button className="shrink-0 flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 transition-all relative z-10">
          Lập chiến lược <FiArrowUpRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SellerDashboard;