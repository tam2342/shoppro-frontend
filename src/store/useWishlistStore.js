import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      
      // 1. Hàm thêm hoặc xóa sản phẩm (Dùng cho nút bấm Tim ở trang chi tiết)
      toggleWishlist: (product) => {
        const currentWishlist = get().wishlist;
        const isExist = currentWishlist.find((item) => item._id === product._id);
        
        if (isExist) {
          // Nếu đã có thì xóa đi (Bỏ tim)
          set({ wishlist: currentWishlist.filter((item) => item._id !== product._id) });
        } else {
          // Nếu chưa có thì thêm vào (Thả tim)
          set({ wishlist: [...currentWishlist, product] });
        }
      },

      // 2. Hàm kiểm tra xem sản phẩm đã được tim chưa
      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item._id === productId);
      },

      // 👉 BỔ SUNG 1: Xóa đích danh một sản phẩm (Rất an toàn khi dùng cho nút "Bỏ thích" ở Profile)
      removeFromWishlist: (productId) => {
        set({ wishlist: get().wishlist.filter((item) => item._id !== productId) });
      },

      // 👉 BỔ SUNG 2: Làm sạch toàn bộ danh sách (Dùng khi user muốn xóa hết nhanh)
      clearWishlist: () => {
        set({ wishlist: [] });
      }
    }),
    {
      name: 'wishlist-storage', // Tên lưu trong LocalStorage của trình duyệt
    }
  )
);