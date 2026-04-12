import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, ShoppingCart, AlertCircle } from 'lucide-react';
import TopBanner from '../components/TopBanner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductSlider from '../components/ProductSlider';
import WhatsAppButton from '../components/WhatsAppButton';
import CartDrawer from '../components/CartDrawer';
import TrustBadges from '../components/TrustBadges';
import { useCart } from '../components/CartContext';
import { useProductConfig } from '../components/ProductConfigContext';
import { useCheckout } from '../components/CheckoutContext';
import OptimizedImage from '../components/OptimizedImage';

const Product = () => {
  const { id } = useParams();
  const {
    getProduct,
    getNewArrivals,
    hasLoadedCatalog,
    ensureProductsLoaded,
    error: configError
  } = useProductConfig();
  const { openCheckout } = useCheckout();
  const imageSliderRef = useRef(null);

  // Get product from context (with images merged)
  const product = getProduct(parseInt(id));
  const newArrivals = getNewArrivals();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(product?.weights?.[0] || '250gm');
  const [quantity, setQuantity] = useState(1);
  
  const { isCartOpen, closeCart, cartItems, updateQuantity: updateCartQuantity, removeItem, addToCart } = useCart();

  useEffect(() => {
    if (!hasLoadedCatalog) {
      ensureProductsLoaded().catch(() => {
        // Error state is already handled in context.
      });
    }
  }, [ensureProductsLoaded, hasLoadedCatalog]);

  // Reset weight selection when product changes
  useEffect(() => {
    if (product?.weights?.[0]) {
      setSelectedWeight(product.weights[0]);
    }
  }, [id, product]);

  if (!hasLoadedCatalog && !configError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasLoadedCatalog && configError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-600 font-montserrat text-sm text-center">
          Unable to load products right now. Please refresh the page.
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-rubik font-bold text-2xl text-primary mb-4">Product Not Found</h1>
          <Link to="/" className="text-secondary hover:underline font-montserrat">
            Go back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.weightPrices?.[selectedWeight] || product.price;
  const images = product.images || [product.image];
  const normalizedProductName = product.name?.toLowerCase();
  const isAvakayaPickle = product.id === 1 || normalizedProductName === 'mango avakaya' || normalizedProductName === 'avakaya pickle' || normalizedProductName === 'avakaya' || normalizedProductName === 'mango pickle';
  const isGonguraPickle = product.id === 2 || normalizedProductName === 'gongura pickle' || normalizedProductName === 'gongura';
  const isGingerPickle = product.id === 10 || normalizedProductName === 'ginger pickle';
  const isLemonPickle = product.id === 11 || normalizedProductName === 'lemon pickle';
  const isRedChilliPickle = product.id === 12 || normalizedProductName === 'red chilli pickle';
  const isUsirikayaPickle = product.id === 13 || normalizedProductName === 'usirikaya pickle';
  const isChickenPickle = product.id === 3 || normalizedProductName === 'chicken pickle';
  const isPrawnPickle = product.id === 4 || normalizedProductName === 'prawns pickle' || normalizedProductName === 'prawn pickle';
  const isMuttonPickle = product.id === 14 || normalizedProductName === 'mutton pickle';
  const isKandiPodi = product.id === 7 || normalizedProductName === 'kandi podi' || normalizedProductName === 'karam podi';
  const isKarvepakuPodi = product.id === 8 || normalizedProductName === 'karvepaku podi';
  const isKobbariPodi = product.id === 9 || normalizedProductName === 'kobbari podi';
  const isMixture = product.id === 101 || normalizedProductName === 'mixture';
  const isMurukulu = product.id === 102 || normalizedProductName === 'murukulu';
  const isRibbonPakodi = product.id === 103 || normalizedProductName === 'ribbon pakodi';
  const isBoorelu = product.id === 205 || product.name?.toLowerCase() === 'boorelu';
  const isAriselu = product.id === 201 || normalizedProductName === 'ariselu';
  const isBandharuLaddu = product.id === 202 || normalizedProductName === 'bandharu laddu';
  const isBoondhiAchu = product.id === 203 || normalizedProductName === 'boondhi achu';
  const isBoondhiLaddu = product.id === 204 || normalizedProductName === 'boondhi laddu';
  const isCashewAchu = product.id === 206 || normalizedProductName === 'cashew achu';
  const isKajjiKayalu = product.id === 207 || normalizedProductName === 'kajji kayalu';
  const isMysorePak = product.id === 208 || normalizedProductName === 'mysore pak' || normalizedProductName === 'mysorepak';
  const isNuvvundalu = product.id === 209 || normalizedProductName === 'nuvvundalu';
  const isPalliUndalu = product.id === 210 || normalizedProductName === 'palli undalu';
  const isSannaBoondhiLaddu = product.id === 211 || normalizedProductName === 'sanna boondhi laddu';
  const isSunnunda = product.id === 212 || normalizedProductName === 'sunnunda';
  const isCloudinaryOptimizedPickle = isAvakayaPickle || isGonguraPickle || isGingerPickle || isLemonPickle || isRedChilliPickle || isUsirikayaPickle;
  const isCloudinaryOptimizedNonVegPodi = isChickenPickle || isPrawnPickle || isMuttonPickle || isKandiPodi || isKarvepakuPodi || isKobbariPodi;
  const isCloudinaryOptimizedSnacks = isMixture || isMurukulu || isRibbonPakodi;
  const isCloudinaryOptimizedLandscape = isCloudinaryOptimizedPickle || isCloudinaryOptimizedNonVegPodi || isCloudinaryOptimizedSnacks;
  const isCloudinaryOptimizedSweet = isAvakayaPickle || isGonguraPickle || isGingerPickle || isLemonPickle || isRedChilliPickle || isUsirikayaPickle || isChickenPickle || isPrawnPickle || isMuttonPickle || isKandiPodi || isKarvepakuPodi || isKobbariPodi || isMixture || isMurukulu || isRibbonPakodi || isBoorelu || isAriselu || isBandharuLaddu || isBoondhiAchu || isBoondhiLaddu || isCashewAchu || isKajjiKayalu || isMysorePak || isNuvvundalu || isPalliUndalu || isSannaBoondhiLaddu || isSunnunda;
  const productImageAlt = isAvakayaPickle
    ? 'Avakaya 1'
  : isGonguraPickle
    ? 'Gongura 1'
  : isGingerPickle
    ? 'Ginger Pickle'
  : isLemonPickle
    ? 'Lemon Pickle'
  : isRedChilliPickle
    ? 'Red Chilli Pickle'
  : isUsirikayaPickle
    ? 'Usirikaya Pickle'
  : isChickenPickle
    ? 'Chicken 1'
  : isPrawnPickle
    ? 'Prawn 1'
  : isMuttonPickle
    ? 'Mutton Pickle'
  : isKandiPodi
    ? 'Kandi Podi'
  : isKarvepakuPodi
    ? 'Karvepaku Podi'
  : isKobbariPodi
    ? 'Kobbari Podi'
  : isMixture
    ? 'Mixture'
  : isMurukulu
    ? 'Murukulu'
  : isRibbonPakodi
    ? 'Ribbon Pakodi'
  : isBoorelu
    ? 'Boorelu'
  : isAriselu
    ? 'Ariselu'
  : isBandharuLaddu
    ? 'Bandharu Laddu'
  : isBoondhiAchu
    ? 'Boondhi Achu'
  : isBoondhiLaddu
    ? 'Boondhi Laddu'
  : isCashewAchu
    ? 'Cashew Achu'
  : isKajjiKayalu
    ? 'Kajji Kayalu'
  : isMysorePak
    ? 'Mysore Pak'
  : isNuvvundalu
    ? 'Nuvvundalu'
  : isPalliUndalu
    ? 'Palli Undalu'
  : isSannaBoondhiLaddu
    ? 'Sanna Boondhi Laddu'
  : isSunnunda
    ? 'Sunnunda'
  : null;
  const getProductImageAlt = (index) => {
    if (isAvakayaPickle) return index === 0 ? 'Avakaya 1' : 'Avakaya 2';
    if (isGonguraPickle) return index === 0 ? 'Gongura 1' : 'Gongura 2';
    if (isChickenPickle) return index === 0 ? 'Chicken 1' : 'Chicken 2';
    if (isPrawnPickle) return index === 0 ? 'Prawn 1' : 'Prawn 2';
    return productImageAlt || `${product.name} ${index + 1}`;
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (product.inStock === false) return;
    addToCart(product, selectedWeight, quantity);
  };

  const handleBuyNow = () => {
    if (product.inStock === false) return;
    addToCart(product, selectedWeight, quantity);
    openCheckout();
  };

  const handleImageScroll = () => {
    if (imageSliderRef.current) {
      const slider = imageSliderRef.current;
      const imageWidth = slider.scrollWidth / images.length;
      const newIndex = Math.round(slider.scrollLeft / imageWidth);
      setCurrentImageIndex(newIndex);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Banner */}
      <TopBanner />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div>
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-montserrat"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Product Details */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images Section - Horizontal Swipe */}
            <div className="space-y-4">
              {/* Image Slider */}
              <div className="relative">
                <div
                  ref={imageSliderRef}
                  onScroll={handleImageScroll}
                  className="flex overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory rounded-2xl lg:rounded-3xl"
                >
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-full aspect-square snap-center"
                    >
                      <div className="w-full h-full bg-white shadow-soft rounded-2xl lg:rounded-3xl overflow-hidden">
                        <OptimizedImage
                          src={img}
                          alt={getProductImageAlt(index)}
                          width={isCloudinaryOptimizedLandscape ? 400 : 600}
                          height={isCloudinaryOptimizedLandscape ? 300 : 600}
                          loading={isCloudinaryOptimizedSweet ? 'lazy' : undefined}
                          sizes={isCloudinaryOptimizedSweet ? '(max-width: 1024px) 100vw, 600px' : undefined}
                          className={isCloudinaryOptimizedLandscape ? 'w-full h-full' : ''}
                          objectFit="cover"
                          priority={isCloudinaryOptimizedSweet ? false : index === 0} // First image loads immediately
                          blur={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dot Indicators */}
                {images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (imageSliderRef.current) {
                            const imageWidth = imageSliderRef.current.scrollWidth / images.length;
                            imageSliderRef.current.scrollTo({
                              left: imageWidth * index,
                              behavior: 'smooth',
                            });
                          }
                        }}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          currentImageIndex === index
                            ? 'bg-primary w-6'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              <span className="text-sm font-medium text-gray-600 uppercase tracking-wide font-montserrat">
                {product.category}
              </span>

              {/* Name */}
              <h1 className="font-rubik font-bold text-3xl sm:text-4xl text-gray-800">
                {product.name}
              </h1>

              {/* Stock Status */}
              {product.inStock === false && (
                <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-montserrat font-medium">Out of Stock</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="font-rubik font-bold text-3xl text-gray-800">
                  ₹{currentPrice}
                </span>
              </div>

              {/* Weight Options */}
              <div className="space-y-3">
                <label className="font-rubik font-semibold text-gray-800">
                  Select Weight
                </label>
                <div className="flex flex-wrap gap-3">
                  {product.weights?.map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      disabled={product.inStock === false}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 font-montserrat ${
                        product.inStock === false
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : selectedWeight === weight
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-primary/10 shadow-soft'
                      }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="font-rubik font-semibold text-gray-800">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center bg-white rounded-xl shadow-soft overflow-hidden ${
                    product.inStock === false ? 'opacity-50' : ''
                  }`}>
                    <button
                      onClick={decreaseQuantity}
                      disabled={product.inStock === false}
                      className={`p-3 transition-colors ${
                        product.inStock === false 
                          ? 'cursor-not-allowed' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="w-14 text-center font-semibold text-gray-800 font-montserrat">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQuantity}
                      disabled={product.inStock === false}
                      className={`p-3 transition-colors ${
                        product.inStock === false 
                          ? 'cursor-not-allowed' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Badges - Scrollable */}
              <div className="space-y-3">
                <label className="font-rubik font-semibold text-gray-800">
                  Why Choose Us
                </label>
                <TrustBadges variant="scroll" />
              </div>

              {/* Add to Cart & Buy Now Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.inStock === false}
                  className={`flex-1 px-8 py-4 font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center gap-3 font-montserrat ${
                    product.inStock === false
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={product.inStock === false}
                  className={`flex-1 px-8 py-4 font-semibold rounded-xl transition-colors duration-300 flex items-center justify-center font-montserrat ${
                    product.inStock === false
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-secondary text-gray-800 hover:bg-secondary-dark'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* You May Also Like Section */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-rubik font-bold text-[28px] sm:text-[32px] lg:text-[33px] text-primary mb-6 sm:mb-8">
              You May Also Like
            </h2>

            {/* Products Slider */}
            <ProductSlider products={newArrivals} />
          </div>
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
        updateQuantity={updateCartQuantity}
        removeItem={removeItem}
      />
    </div>
  );
};

export default Product;
