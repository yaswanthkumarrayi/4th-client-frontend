/**
 * Product Configuration Context
 * 
 * Fetches products from backend API and merges with frontend images.
 * This is the single source of truth for product data in the frontend.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../services/apiConfig.js';
import { mergeProductWithImages, calculateWeightPrices } from '../data';
import { bestSellerIds, newArrivalIds } from '../data';

const ProductConfigContext = createContext();

export const useProductConfig = () => {
  const context = useContext(ProductConfigContext);
  if (!context) {
    throw new Error('useProductConfig must be used within a ProductConfigProvider');
  }
  return context;
};

export const ProductConfigProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Fetch products from backend API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching products from API...');
      
      const response = await fetch(`${API_URL}/orders/products`);
      const data = await response.json();
      
      if (data.success && data.products) {
        // Merge API data with frontend images
        const productsWithImages = data.products.map(product => mergeProductWithImages(product));
        setProducts(productsWithImages);
        setLastFetched(new Date());
        console.log(`✅ Loaded ${productsWithImages.length} products`);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
      
      setError(null);
    } catch (err) {
      console.error('❌ Failed to fetch products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get product by ID
  const getProduct = useCallback((productId) => {
    const id = parseInt(productId);
    return products.find(p => p.id === id || p.productId === id) || null;
  }, [products]);

  // Get all active products
  const getAllProducts = useCallback(() => {
    return products.filter(p => p.isActive !== false);
  }, [products]);

  // Get products by category
  const getProductsByCategory = useCallback((category) => {
    return getAllProducts().filter(p => {
      const productCategory = p.category.toLowerCase().replace(/\s+/g, '-');
      const searchCategory = category.toLowerCase().replace(/\s+/g, '-');
      return productCategory === searchCategory || p.category === category;
    });
  }, [getAllProducts]);

  // Get best sellers (products featured on homepage)
  const getBestSellers = useCallback(() => {
    return bestSellerIds
      .map(id => getProduct(id))
      .filter(p => p !== null && p.isActive !== false);
  }, [getProduct]);

  // Get new arrivals
  const getNewArrivals = useCallback(() => {
    return newArrivalIds
      .map(id => getProduct(id))
      .filter(p => p !== null && p.isActive !== false);
  }, [getProduct]);

  // Check if product is in stock
  const isInStock = useCallback((productId) => {
    const product = getProduct(productId);
    return product ? product.inStock !== false : false;
  }, [getProduct]);

  // Refresh products from API
  const refreshProducts = useCallback(() => {
    return fetchProducts();
  }, [fetchProducts]);

  const value = {
    // State
    products,
    loading,
    error,
    lastFetched,
    
    // Methods
    getProduct,
    getAllProducts,
    getProductsByCategory,
    getBestSellers,
    getNewArrivals,
    isInStock,
    refreshProducts,
    
    // Utility
    calculateWeightPrices,
  };

  return (
    <ProductConfigContext.Provider value={value}>
      {children}
    </ProductConfigContext.Provider>
  );
};

export default ProductConfigContext;
