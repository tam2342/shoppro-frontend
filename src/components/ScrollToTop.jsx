import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Mỗi khi đường dẫn (pathname) thay đổi, tự động cuộn lên x=0, y=0
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Component này chạy ngầm, không render ra UI gì cả
};

export default ScrollToTop;