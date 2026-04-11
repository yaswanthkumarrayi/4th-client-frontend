import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import { useCart } from './CartContext';
import { useProductConfig } from './ProductConfigContext';
import OptimizedImage from './OptimizedImage';

const FoodCard = ({ product: baseProduct }) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();
  const { getProduct } = useProductConfig();
  
  // Get product with overrides (price & stock)
  const product = getProduct(baseProduct.id) || baseProduct;
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
  : product.name;

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
        <OptimizedImage
          src={product.image}
          alt={productImageAlt}
          width={400}
          height={isCloudinaryOptimizedLandscape ? 300 : 400}
          loading={isCloudinaryOptimizedSweet ? 'lazy' : undefined}
          sizes={isCloudinaryOptimizedSweet ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px' : undefined}
          className={`${isCloudinaryOptimizedLandscape ? 'w-full h-full ' : ''}transition-all duration-500 group-hover:scale-105 ${
            isOutOfStock ? 'opacity-60 grayscale-[30%]' : ''
          }`}
          objectFit="cover"
          blur={true}
          priority={false}
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

export default React.memo(FoodCard);
