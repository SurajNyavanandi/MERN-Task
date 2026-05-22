import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <Sidebar />
      {children}
    </div>
  );
}

export default MainLayout;