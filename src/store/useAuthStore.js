import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Ban đầu chưa có ai đăng nhập
      isAuthenticated: false,
      
      // Hàm login nhận dữ liệu thật từ API trả về và lưu lại
      login: (userData) => set({ 
        user: userData, 
        isAuthenticated: true 
      }),
      
      // Hàm đăng xuất: Xóa sạch dữ liệu
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'shoppro-auth', // Tên chìa khóa lưu trong bộ nhớ trình duyệt (localStorage)
    }
  )
);