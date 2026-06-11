import { useParams, useLocation } from 'react-router-dom';

// 👉 BỘ NỘI DUNG BLOG DÀI ĐẬM CHẤT TẠP CHÍ CÔNG NGHỆ (MỖI HÃNG 3 CHƯƠNG)
const BRAND_STORIES = {
  'apple': {
    name: 'Apple',
    slogan: 'Nghĩ Khác Biệt và Định Hình Lại Thế Giới',
    coverImage: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop',
    themeClass: 'from-gray-900 to-black text-white',
    accentColor: 'border-white',
    
    // Chương 1
    ch1Title: 'Chương I: Gara Xe Cũ và Giấc Mơ Thay Đổi Nhân Loại',
    ch1Text: 'Mùa hè năm 1976, trong một gara để xe chật hẹp tại Los Altos, California, hai chàng trai trẻ mang tên Steve Jobs và Steve Wozniak đã tạo nên chiếc máy tính đầu tiên của họ. Giữa một thời đại mà máy tính được xem là những cỗ máy khổng lồ, lạnh lẽo chỉ dành cho quân đội và tập đoàn lớn, Apple đã ra đời với một niềm tin điên rồ: "Mỗi cá nhân trên thế giới này đều xứng đáng sở hữu một chiếc máy tính cá nhân để giải phóng sức sáng tạo". Sự ám ảnh về cái đẹp, tư duy thẩm mỹ khác biệt và sự kết hợp hoàn mỹ giữa phần cứng và phần mềm đã đặt những viên gạch đầu tiên cho một đế chế nghìn tỷ đô sau này.',
    
    // Chương 2 (Spotlight)
    ch2Title: 'Chương II: Những Bước Ngoặt Phá Bỡ Mọi Định Kiến',
    ch2Text: 'Lịch sử công nghệ thế giới đã phải vẽ lại bản đồ rất nhiều lần sau mỗi cái búng tay của Apple. Năm 1998, chiếc iMac G3 sắc màu rực rỡ đập tan định kiến máy tính là phải có màu be cục mịch. Năm 2001, chiếc iPod nhỏ gọn cùng câu Slogan "1,000 bài hát trong túi bạn" đã hồi sinh ngành công nghiệp âm nhạc đang trên đà sụp đổ. Và đỉnh điểm là năm 2007, khi chiếc iPhone đầu tiên được Jobs vén màn, nó không chỉ là một chiếc điện thoại – nó đã định nghĩa lại hoàn toàn cách nhân loại kết nối, giải trí và sinh hoạt mỗi ngày cho đến tận hôm nay.',
    ch2Img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1626&auto=format&fit=crop',
    
    // Chương 3
    ch3Title: 'Chương III: Kỷ Nguyên Silicon và Tầm Nhìn Thập Kỷ Kế Tiếp',
    ch3Text: 'Không bao giờ ngủ quên trên chiến thắng, Apple tiếp tục thực hiện một cuộc đại cách mạng ngầm khi tuyên bố chia tay Intel để tự phát triển dòng chip Apple Silicon (M-series). Quyết định này giúp hãng hoàn toàn làm chủ chuỗi cung ứng kỹ thuật và tối ưu hóa hiệu năng phần cứng lên mức không tưởng. Hướng tới tương lai, với sự xuất hiện của các vật liệu bền vững như Titanium cấp hàng không vũ trụ và các công nghệ thực tế ảo không gian, Apple không chỉ muốn tạo ra thiết bị – họ đang xây dựng một vũ trụ nơi ranh giới giữa thế giới vật lý và thế giới kỹ thuật số hoàn toàn bị xóa nhòa.'
  },
  'samsung': {
    name: 'Samsung',
    slogan: 'Tiên Phong Công Nghệ - Kiến Tạo Tương Lai',
    coverImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=2070&auto=format&fit=crop',
    themeClass: 'from-blue-900 to-indigo-950 text-white',
    accentColor: 'border-blue-500',
    
    ch1Title: 'Chương I: Từ Công Ty Xuất Khẩu Nhỏ Đến Kỳ Tích Sông Hàn',
    ch1Text: 'Ít ai biết rằng, tập đoàn công nghệ hàng đầu thế giới Samsung từng khởi đầu vào năm 1938 như một công ty thương mại nhỏ chuyên xuất khẩu cá khô và rau củ. Trải qua những thăng trầm của lịch sử, với tinh thần bền bỉ và khát vọng vươn tầm, Samsung đã đặt cược toàn bộ vận mệnh vào ngành công nghiệp bán dẫn và điện tử vào cuối thế kỷ 20. Sự quyết đoán đó đã tạo nên một "Kỳ tích sông Hàn", biến một doanh nghiệp nội địa thành một biểu tượng công nghệ toàn cầu, đại diện cho ý chí vươn lên không ngừng nghỉ.',
    
    ch2Title: 'Chương II: Định Nghĩa Lại Trải Nghiệm Nghe Nhìn',
    ch2Text: 'Samsung luôn là cái tên gắn liền với những cuộc cách mạng về hiển thị. Từ việc dẫn đầu thị phần TV màn hình phẳng toàn cầu, cho đến việc khai phá phân khúc điện thoại màn hình lớn (Phablet) với dòng Galaxy Note huyền thoại cùng cây bút S-Pen quyền năng. Khi cả thế giới nghi ngờ về độ bền của những tấm nền dẻo, Samsung đã chứng minh vị thế dẫn đầu bằng việc thương mại hóa thành công smartphone màn hình gập Galaxy Z Fold và Z Flip, mở ra một phân khúc hoàn toàn mới cho ngành di động.',
    ch2Img: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?q=80&w=2070&auto=format&fit=crop',
    
    ch3Title: 'Chương III: Hệ Sinh Thái Thông Minh và Cuộc Cách Mạng Xanh',
    ch3Text: 'Bước vào kỷ nguyên mới, tầm nhìn của Samsung vượt ra khỏi ranh giới của những chiếc phần cứng đơn lẻ. Thông qua nền tảng SmartThings, hãng đang kết nối hàng tỷ thiết bị từ tủ lạnh, máy giặt, điều hòa cho đến smartphone thành một thực thể thông minh thống nhất, tự động thấu hiểu thói quen của người dùng. Đồng thời, với cam kết sử dụng vật liệu tái chế từ lưới đánh cá bị bỏ hoang trên biển và cắt giảm khí thải, Samsung đang nỗ lực kiến tạo một tương lai nơi công nghệ đỉnh cao song hành cùng sự sống xanh bền vững.'
  },
  'xiaomi': {
    name: 'Xiaomi',
    slogan: 'Đổi Mới Công Nghệ Dành Cho Mọi Người',
    coverImage: 'https://images.unsplash.com/photo-1521939094609-93aba1af40d7?q=80&w=2070&auto=format&fit=crop',
    themeClass: 'from-orange-500 to-red-600 text-white',
    accentColor: 'border-orange-400',
    
    ch1Title: 'Chương I: Khát Vọng Phổ Cập Công Nghệ Cao',
    ch1Text: 'Thành lập vào năm 2010 bởi Lei Jun và các cộng sự, Xiaomi ra đời với một triết lý vô cùng nhân văn nhưng đầy thách thức: "Công nghệ chất lượng cao không nên là đặc quyền của người giàu". Trong bối cảnh thị trường smartphone bị thống trị bởi các ông lớn với mức giá đắt đỏ, Xiaomi đã làm chấn động ngành công nghiệp bằng việc tung ra các thiết bị cấu hình flagship với mức giá gần như tối thiểu, chấp nhận tỷ lệ lợi nhuận phần cứng không quá 5%. Triết lý này đã giúp hàng triệu người dùng trên thế giới lần đầu tiên được tiếp cận với internet tốc độ cao và các tính năng thông minh.',
    
    ch2Title: 'Chương II: Đốm Lửa Nhỏ Thành Đế Chế IoT Lớn Nhất Hành Tinh',
    ch2Text: 'Không thỏa mãn với danh hiệu "vua cấu hình giá rẻ", Xiaomi bắt tay vào xây dựng một chiến lược táo bạo: Đầu tư vào hàng trăm công ty khởi nghiệp để tạo ra một hệ sinh thái IoT (Internet vạn vật) khổng lồ dưới thương hiệu Mi. Từ chiếc vòng đeo tay Mi Band, máy lọc không khí, robot hút bụi cho đến xe điện thông minh mới ra mắt gần đây. Xiaomi đã kết nối tất cả chúng lại, biến những món đồ gia dụng vô tri trở nên thông minh, biến việc quản lý ngôi nhà trở nên đơn giản chỉ bằng vài cú chạm trên màn hình.',
    ch2Img: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?q=80&w=2071&auto=format&fit=crop',
    
    ch3Title: 'Chương III: Tương Lai Của Sự Kết Nối Toàn Diện',
    ch3Text: 'Tầm nhìn của Xiaomi trong thập kỷ tới được gói gọn trong chiến lược "Người - Xe - Nhà". Với việc ra mắt hệ điều hành thống nhất HyperOS và những bước đi thần tốc trong ngành công nghiệp xe điện thông minh (EV), Xiaomi đang hoàn thiện mảnh ghép cuối cùng của cuộc sống kết nối. Họ không chỉ bán sản phẩm, họ đang tạo ra một mạng lưới nhận thức thông minh nhân tạo bao quanh con người, hỗ trợ và nâng tầm cuộc sống ở mọi lúc, mọi nơi.'
  },
  'default': {
    name: 'Thương Hiệu Toàn Cầu',
    slogan: 'Cam Kết Sáng Tạo và Chất Lượng Vượt Trội',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    themeClass: 'from-blue-700 to-indigo-900 text-white',
    accentColor: 'border-white',
    
    ch1Title: 'Chương I: Tinh Thần Khởi Nghiệp và Khát Vọng Sáng Tạo',
    ch1Text: 'Mỗi thương hiệu lớn xuất hiện tại ShopPro đều mang trong mình một câu chuyện khởi nghiệp đầy cảm hứng. Bắt đầu từ những ý tưởng sơ khai trên bản vẽ, trải qua hàng ngàn giờ thử nghiệm khắc nghiệt, các kỹ sư đã biến những lý thuyết khô khan thành những sản phẩm thực tế, có khả năng giải quyết các vấn đề cốt lõi của cuộc sống con người.',
    
    ch2Title: 'Chương II: Vượt Qua Giới Hạn Công Nghệ',
    ch2Text: 'Để duy trì vị thế trong lòng người tiêu dùng, các thương hiệu liên tục đầu tư nghiên cứu và phát triển để bứt phá khỏi những ranh giới cũ. Những cải tiến về hiệu năng, độ bền vật liệu hay trí tuệ nhân tạo tích hợp sâu đều hướng tới một mục đích duy nhất: Mang lại trải nghiệm hoàn hảo và trực quan nhất cho người sử dụng.',
    ch2Img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
    
    ch3Title: 'Chương III: Kiến Tạo Xu Hướng Sống Mới',
    ch3Text: 'Tương lai của công nghệ không chỉ dừng lại ở các thông số phần cứng, mà là cách chúng định hình phong cách sống mới: thông minh hơn, tiện lợi hơn và thân thiện với môi trường hơn. Hãy cùng chúng tôi tiếp tục đồng hành và khám phá những chương tiếp theo trong biên niên sử của sự đổi mới.'
  }
};

const BrandDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  
  // Lấy dữ liệu bài viết dựa theo ID hãng trên URL
  const article = BRAND_STORIES[id] || BRAND_STORIES['default'];
  const displayName = location.state?.name || article.name; 

  return (
    <div className="bg-white min-h-screen antialiased selection:bg-blue-500 selection:text-white">
      
      {/* SECTION 1: HERO COVER (ẢNH BÌA TRÀN MÀN HÌNH + TIÊU ĐỀ KHỔ LỚN) */}
      <div className="relative w-full h-[70vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src={article.coverImage} 
          alt={displayName} 
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-[scaleUp_20s_ease-out_infinite]"
        />
        <div className="relative z-20 text-center text-white px-6 max-w-4xl space-y-4">
          <span className="text-xs md:text-sm font-bold tracking-[0.4em] uppercase opacity-80 block animate-pulse">
            Biên niên sử thương hiệu
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter drop-shadow-2xl uppercase">
            {displayName}
          </h1>
          <div className="w-16 h-[2px] bg-white mx-auto my-6 opacity-60"></div>
          <p className="text-lg md:text-2xl font-light italic opacity-90 drop-shadow-md max-w-2xl mx-auto leading-relaxed">
            "{article.slogan}"
          </p>
        </div>
      </div>

      {/* CONTAINER CHÍNH - CHIẾM 85% ĐỒNG BỘ GIAO DIỆN HOME */}
      <div className="w-[90%] lg:w-[85%] mx-auto py-16 md:py-24">
        
        {/* SECTION 2: CHƯƠNG I - KHỞI NGUỒN (DẠNG VĂN BẢN TẠP CHÍ) */}
        <div className="max-w-3xl mx-auto mb-24 md:mb-36 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight uppercase">
            {article.ch1Title}
          </h2>
          <div className="w-12 h-1 bg-gray-300 mx-auto rounded"></div>
          <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed md:leading-loose text-justify md:text-center first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-gray-900">
            {article.ch1Text}
          </p>
        </div>

        {/* SECTION 3: CHƯƠNG II - BƯỚC NGOẶT (DẠNG LAYOUT ZIGZAG SANG TRỌNG) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-24 md:mb-36">
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src={article.ch2Img} 
                alt={article.ch2Title} 
                className="w-full h-[350px] md:h-[550px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className={`border-l-4 ${article.accentColor} pl-4`}>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight uppercase">
                {article.ch2Title}
              </h3>
            </div>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light text-justify">
              {article.ch2Text}
            </p>
          </div>
        </div>

        {/* SECTION 4: CHƯƠNG III - TẦM NHÌN TƯƠNG LAI (KẾT BÀI ĐẬM CHẤT LANDING PAGE) */}
        <div className={`bg-gradient-to-br ${article.themeClass} rounded-[2rem] p-8 md:p-16 shadow-xl relative overflow-hidden text-center max-w-5xl mx-auto`}>
          <div className="absolute top-[-50%] left-[-20%] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-50%] right-[-20%] w-96 h-96 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight">
              {article.ch3Title}
            </h2>
            <div className="w-16 h-[1px] bg-white/40 mx-auto"></div>
            <p className="text-base md:text-lg opacity-85 leading-relaxed md:leading-loose font-light text-justify md:text-center">
              {article.ch3Text}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BrandDetail;