import { createContext, useContext, useState, useEffect } from 'react';
import { productCatalog as staticProducts, calculateWeightPrices } from '../data';

const ProductConfigContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useProductConfig = () => {
  const context = useContext(ProductConfigContext);
  if (!context) {
    throw new Error('useProductConfig must be used within a ProductConfigProvider');
  }
  return context;
};

export const ProductConfigProvider = ({ children }) => {
  const [productOverrides, setProductOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product config from backend
  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders/products`);
      const data = await response.json();
      
      if (data.success && data.products) {
        // Create a map of productId -> override data
        const overrideMap = {};
        data.products.forEach(product => {
          overrideMap[product.id] = {
            pricePerKg: product.pricePerKg,
            price: product.price,
            weightPrices: product.weightPrices,
            inStock: product.inStock,
            isActive: product.isActive
          };
        });
        setProductOverrides(overrideMap);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch product config:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Get merged product with overrides
  const getProduct = (productId) => {
    const baseProduct = staticProducts.find(p => p.id === parseInt(productId));
    if (!baseProduct) return null;

    const override = productOverrides[baseProduct.id];
    
    if (override) {
      return {
        ...baseProduct,
        pricePerKg: override.pricePerKg || baseProduct.pricePerKg,
        price: override.price || baseProduct.price,
        weightPrices: override.weightPrices || baseProduct.weightPrices,
        inStock: override.inStock !== undefined ? override.inStock : true,
        isActive: override.isActive !== undefined ? override.isActive : true
      };
    }

    return {
      ...baseProduct,
      inStock: true,
      isActive: true
    };
  };

  // Get all products with overrides merged
  const getAllProducts = () => {
    return staticProducts.map(product => getProduct(product.id)).filter(p => p && p.isActive);
  };

  // Get products by category with overrides
  const getProductsByCategory = (category) => {
    return getAllProducts().filter(p => 
      p.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase() ||
      p.category === category
    );
  };

  // Check if product is in stock
  const isInStock = (productId) => {
    const product = getProduct(productId);
    return product ? product.inStock : false;
  };

  // Refresh config
  const refreshConfig = () => {
    fetchConfig();
  };

  return (
    <ProductConfigContext.Provider
      value={{
        loading,
        error,
        getProduct,
        getAllProducts,
        getProductsByCategory,
        isInStock,
        refreshConfig,
        productOverrides
      }}
    >
      {children}
    </ProductConfigContext.Provider>
  );
};

export default ProductConfigContext;
