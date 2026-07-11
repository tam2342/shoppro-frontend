import { useEffect, useState } from 'react';
import { FiMail, FiMapPin, FiShield, FiCheckCircle } from 'react-icons/fi';
import { FaFacebook } from 'react-icons/fa';

// Nạp font Space Grotesk cho phần wordmark & nhãn — chỉ chạy 1 lần
const useDisplayFont = () => {
  useEffect(() => {
    if (document.getElementById('sp-grotesk-font')) return;
    const link = document.createElement('link');
    link.id = 'sp-grotesk-font';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap';
    document.head.appendChild(link);
  }, []);
};

// Cửa hàng mở cửa 08:00 - 21:00 hằng ngày — tính trạng thái theo giờ thực
const useStoreStatus = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const check = () => {
      const hour = new Date().getHours();
      setIsOpen(hour >= 8 && hour < 21);
    };
    check();
    const timer = setInterval(check, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return isOpen;
};

const Footer = () => {
  useDisplayFont();
  const isOpen = useStoreStatus();

  return (
    <footer className="bg-[#0B1220] text-[#E8ECF4] mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Thương hiệu */}
          <div className="lg:col-span-4 space-y-5">
            <h3
              className="text-2xl font-semibold tracking-tight text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ShopPro<span className="text-[#2F6FED]">.</span>
            </h3>
            <p className="text-sm leading-relaxed text-[#7C8AA6] max-w-xs">
              Hệ sinh thái thương mại điện tử cung cấp sản phẩm công nghệ chất lượng cao,
              hậu mãi minh bạch và giao hàng đáng tin cậy.
            </p>
            <a
              href="https://www.facebook.com/profile.php?id=61591330277895"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#7C8AA6] hover:text-white transition-colors group"
            >
              <span className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#2F6FED] group-hover:text-[#2F6FED] transition-colors">
                <FaFacebook size={16} />
              </span>
              Theo dõi Fanpage
            </a>
          </div>

          {/* Chính sách */}
          <div className="lg:col-span-2">
            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4E5D7A] mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Khách hàng
            </h4>
            <ul className="space-y-3 text-sm text-[#A9B4C7]">
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          {/* Liên hệ + thanh toán */}
          <div className="lg:col-span-3">
            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4E5D7A] mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Liên hệ
            </h4>
            <a
              href="mailto:admin@tamsu.id.vn"
              className="flex items-center gap-2.5 text-sm text-[#A9B4C7] hover:text-white transition-colors mb-8"
            >
              <FiMail className="text-[#2F6FED]" size={16} />
              admin@tamsu.id.vn
            </a>

            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4E5D7A] mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Thanh toán
            </h4>
            <div className="flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold tracking-wide">
                VNPAY
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold tracking-wide">
                PayPal
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-[#4E5D7A] mt-3">
              <FiShield size={12} /> Giao dịch được mã hóa & bảo mật
            </p>
          </div>

          {/* Bản đồ — thẻ chữ ký của thiết kế */}
          <div className="lg:col-span-3">
            <h4
              className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4E5D7A] mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ghé thăm cửa hàng
            </h4>
            <div className="relative rounded-2xl rounded-tr-md overflow-hidden border border-white/10 group">
              <iframe
                title="Vị trí cửa hàng ShopPro"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.9369145729797!2d106.81150097468759!3d10.892399057044559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8ca6ca1c2a1%3A0x8dece77bfff19bb2!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEPDtG5nIG5naOG7hyBjYW8gxJDhu5NuZyBBbg!5e0!3m2!1svi!2s!4v1783793477481!5m2!1svi!2s"
                width="100%"
                height="160"
                style={{ border: 0, filter: 'grayscale(0.4) invert(0.92) contrast(0.9)' }}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="block"
              />
              <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B1220]/90 border border-white/10 text-[11px] font-medium">
                <FiMapPin size={11} className="text-[#2F6FED]" />
                Địa chỉ cửa hàng
              </div>
              <div
                className={`absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  isOpen ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-[#7C8AA6]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-[#7C8AA6]'}`} />
                {isOpen ? 'Đang mở cửa' : 'Đã đóng cửa'}
              </div>
            </div>
            <p className="text-[11px] text-[#4E5D7A] mt-2">08:00 – 21:00 hằng ngày</p>
          </div>
        </div>
      </div>

      {/* Thanh dưới cùng */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#4E5D7A]">© 2026 ShopPro. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-xs text-[#4E5D7A]">
            <FiCheckCircle size={12} className="text-[#2F6FED]" />
            Thanh toán an toàn qua VNPay &amp; PayPal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;