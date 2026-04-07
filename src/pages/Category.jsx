import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react';
import TopBanner from '../components/TopBanner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import WhatsAppButton from '../components/WhatsAppButton';
import CartDrawer from '../components/CartDrawer';
import FilterDrawer from '../components/FilterDrawer';
import { useCart } from '../components/CartContext';
import { useProductConfig } from '../components/ProductConfigContext';

const Category = () => {
  const { slug } = useParams();
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeItem } = useCart();
  const { getProductsByCategory } = useProductConfig();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    availability: [],
    price: { min: 0, max: 10000 },
  });
  
  // Convert slug to category name
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get products by category with overrides applied
  const categoryProducts = getProductsByCategory(categoryName);

  // Apply filters
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) => {
      // Price filter
      const price = product.price;
      if (price < filters.price.min || price > filters.price.max) {
        return false;
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const isInStock = product.inStock !== false;
        if (filters.availability.includes('In Stock') && !isInStock) return false;
        if (filters.availability.includes('Out of Stock') && isInStock) return false;
      }

      return true;
    });
  }, [categoryProducts, filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen">
      {/* Top Banner */}
      <TopBanner />

      {/* Navbar */}
      <Navbar />

      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-montserrat text-sm mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Category Title */}
          <h1 className="font-rubik font-bold text-[32px] sm:text-[38px] lg:text-[42px] text-gray-800">
            {categoryName}
          </h1>
        </div>
        {/* Divider Line */}
        <div className="border-b border-gray-200/50" />
      </div>

      {/* Main Content */}
      <div className="min-h-screen">
        {/* Filter Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-montserrat text-sm">
              {filteredProducts.length} products available
            </p>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-montserrat text-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
              Filter
            </button>
          </div>
        </div>

        {/* Products Grid - 2 per row */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <FoodCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 font-montserrat">No products found matching your filters.</p>
              <button
                onClick={() => setFilters({ availability: [], price: { min: 0, max: 10000 } })}
                className="mt-4 text-primary hover:underline font-montserrat text-sm"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

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

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default Category;
