// src/hooks/useBrandNavigation.js
import { useNavigate } from 'react-router-dom';

export const useBrandNavigation = () => {
  const navigate = useNavigate();

  /**
   * Hàm điều hướng sang trang chi tiết/giới thiệu thương hiệu
   * @param {string} brandId - ID của thương hiệu trong DB
   * @param {string} brandName - Tên thương hiệu (bỏ vào state để hiển thị ngay không cần đợi load)
   */
  const goToBrand = (brandId, brandName = '') => {
    if (!brandId) {
      console.error("❌ Không tìm thấy ID thương hiệu!");
      return;
    }
    
    // Điều hướng sang trang /brand/:id và truyền kèm tên thương hiệu làm kỷ niệm
    navigate(`/brand/${brandId}`, { 
      state: { name: brandName } 
    });
  };

  return { goToBrand };
};