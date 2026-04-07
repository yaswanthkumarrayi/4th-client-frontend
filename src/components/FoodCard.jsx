import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { useCart } from './CartContext';
import { useProductConfig } from './ProductConfigContext';

const FoodCard = ({ product: baseProduct }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { getProduct } = useProductConfig();
  
  // Get product with overrides (price & stock)
  const product = getProduct(baseProduct.id) || baseProduct;

  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.inStock === false;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't add if out of stock
    if (isOutOfStock) return;
    
    const defaultWeight = product.weights?.[0] || '250gm';
    addToCart(product, defaultWeight, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group block bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 relative"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            isOutOfStock ? 'opacity-60 grayscale-[30%]' : ''
          }`}
        />

        {/* Out of Stock Overlay Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold font-montserrat text-sm shadow-lg">
              OUT OF STOCK
            </div>
          </div>
        )}

        {/* Discount Badge - Top Left Corner Edge */}
        {discount > 0 && !isOutOfStock && (
          <div className="absolute top-0 left-0 px-3 py-1.5 bg-secondary text-gray-800 text-xs font-bold rounded-br-xl font-montserrat">
            {discount}% OFF
          </div>
        )}

        {/* Add to Cart Button - Bottom Right */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-soft ${
            isOutOfStock
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : isAdded
              ? 'bg-secondary text-gray-800'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {isAdded ? (
            <Check className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-5">
        {/* Name */}
        <h3 className={`font-rubik font-semibold mb-2 line-clamp-1 transition-colors duration-200 ${
          isOutOfStock 
            ? 'text-gray-500' 
            : 'text-gray-800 group-hover:text-primary'
        }`}>
          {product.name}
        </h3>

        {/* Stock Status & Price */}
        {isOutOfStock ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-red-600 font-montserrat">Out of Stock</span>
            <span className="text-sm text-gray-400 line-through font-montserrat">₹{product.price}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-800 font-rubik">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through font-montserrat">₹{product.originalPrice}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default FoodCard;
