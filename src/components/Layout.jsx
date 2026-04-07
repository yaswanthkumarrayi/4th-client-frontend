import TopBanner from './TopBanner';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      {/* Top Banner - Scrolls away naturally */}
      <TopBanner />
      
      {/* Navbar - Sticky at top after banner scrolls away */}
      <Navbar />
      
      {/* Main Content - No padding needed since sticky navbar handles it */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
