import { useEffect, useState } from 'react';

/**
 * Nút chuyển VI/EN dùng Google Translate widget.
 * Cách dùng: đặt <GoogleTranslateSwitcher /> trong Header/Navbar, chỉ cần làm 1 lần.
 * Không cần sửa bất kỳ component nào khác trong site.
 */
const GoogleTranslateSwitcher = () => {
  const [lang, setLang] = useState('vi');

  useEffect(() => {
    // Tránh nạp script 2 lần nếu component re-render
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      // eslint-disable-next-line no-undef
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'vi',
          includedLanguages: 'en,vi',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const switchLanguage = (targetLang) => {
    setLang(targetLang);

    // Google Translate lưu lựa chọn ngôn ngữ vào cookie 'googtrans'
    const setCookie = (value) => {
      document.cookie = `googtrans=${value}; path=/`;
      document.cookie = `googtrans=${value}; domain=${window.location.hostname}; path=/`;
    };

    if (targetLang === 'vi') {
      // Về lại tiếng Việt gốc = xóa cookie dịch
      setCookie('/vi/vi');
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } else {
      setCookie(`/vi/${targetLang}`);
    }

    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1">
      {/* Vùng ẩn bắt buộc để Google Translate khởi tạo, không hiển thị thanh mặc định xấu của Google */}
      <div id="google_translate_element" style={{ display: 'none' }} />

      <button
        onClick={() => switchLanguage('vi')}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
          lang === 'vi' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        VI
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
          lang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default GoogleTranslateSwitcher;