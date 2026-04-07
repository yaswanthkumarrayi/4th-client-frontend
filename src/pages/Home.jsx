import TopBanner from '../components/TopBanner';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CollectionSlider from '../components/CollectionSlider';
import ProductSlider from '../components/ProductSlider';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import CartDrawer from '../components/CartDrawer';
import TrustBadges from '../components/TrustBadges';
import { useCart } from '../components/CartContext';
import { useProductConfig } from '../components/ProductConfigContext';
import { categories } from '../data';

const Home = () => {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeItem } = useCart();
  const { getBestSellers, getNewArrivals, loading } = useProductConfig();
  
  // Get products from API via context
  const bestSellers = getBestSellers();
  const newArrivals = getNewArrivals();

  return (
    <div className="min-h-screen">
      {/* Top Banner */}
      <TopBanner />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Content sections */}
      <div>
        {/* Collections Section */}
        <section id="collections" className="py-10 sm:py-14 lg:py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <h2 className="font-rubik font-bold text-[28px] sm:text-[32px] lg:text-[33px] text-primary mb-6 sm:mb-8">
              Collections
            </h2>

            {/* Categories - Horizontal Scroll with Center Focus */}
            <CollectionSlider categories={categories} />
          </div>
        </section>

        {/* Best Sellers Section */}
        <section id="bestsellers" className="py-10 sm:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <h2 className="font-rubik font-bold text-[28px] sm:text-[32px] lg:text-[33px] text-primary mb-6 sm:mb-8">
              Our Best Sellers
            </h2>

            {/* Products Slider */}
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ProductSlider products={bestSellers} />
            )}
          </div>
        </section>

        {/* You May Also Like Section */}
        <section id="youmaylike" className="py-10 sm:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <h2 className="font-rubik font-bold text-[28px] sm:text-[32px] lg:text-[33px] text-primary mb-6 sm:mb-8">
              You May Also Like
            </h2>

            {/* Products Slider */}
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ProductSlider products={newArrivals} />
            )}
          </div>
        </section>

        {/* Trust Badges Section - Before Footer */}
        <TrustBadges variant="full" />

        {/* Footer */}
        <Footer />
      </div>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </div>
  );
};

export default Home;
