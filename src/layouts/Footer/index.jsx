const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">ShopPro.</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Hệ sinh thái thương mại điện tử hàng đầu cung cấp sản phẩm công nghệ chất lượng cao.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 uppercase text-sm tracking-wider">Khách hàng</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><a href="#" className="hover:text-white transition">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-white transition">Chính sách đổi trả</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 uppercase text-sm tracking-wider">Liên hệ</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Hotline: 1900 1234</li>
            <li>Email: support@shoppro.vn</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        © 2026 ShopPro. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;