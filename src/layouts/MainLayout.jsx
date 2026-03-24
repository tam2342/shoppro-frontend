import { Outlet } from 'react-router-dom';
// Việc dùng index.jsx ở trên giúp đường dẫn import ở đây cực kỳ sạch sẽ
import Header from './Header'; 
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 width-100">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;