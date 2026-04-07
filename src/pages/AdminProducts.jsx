import { useState, useEffect } from 'react';
import { 
  Package, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  RefreshCcw
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching products from API...');
      const data = await adminAPI.getProducts();
      
      if (data.success) {
        console.log('✅ Products fetched:', data.products.length);
        setProducts(data.products);
        setErrorMessage('');
      } else {
        console.error('❌ Failed to fetch products:', data.message);
        setErrorMessage(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      setErrorMessage('Failed to fetch products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, updateData) => {
    try {
      setSaving(productId);
      setErrorMessage('');
      
      console.log('🔄 Updating product:', productId, updateData);
      
      const result = await adminAPI.updateProduct(productId, updateData);
      
      if (!result.success) {
        throw new Error(result.message || 'Update failed');
      }
      
      console.log('✅ Product updated successfully:', result.product);
      
      // Refetch all products to ensure UI is in sync with database
      await fetchProducts();
      
      setSuccessMessage(`Product updated successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('❌ Failed to update product:', error);
      setErrorMessage('Failed to update: ' + error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving(null);
    }
  };

  const toggleStock = async (product) => {
    console.log('🔄 Toggling stock for:', product.name, 'Current:', product.inStock);
    await updateProduct(product.id, {
      inStock: !product.inStock
    });
  };

  const handlePriceUpdate = async (product, newPrice) => {
    const pricePerKg = parseInt(newPrice);
    if (isNaN(pricePerKg) || pricePerKg < 0) {
      setErrorMessage('Please enter a valid price (must be a positive number)');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    console.log('🔄 Updating price for:', product.name, 'New price:', pricePerKg);
    await updateProduct(product.id, {
      pricePerKg
    });
  };

  const resetProduct = async (productId) => {
    if (!confirm('Reset this product to default values?')) return;
    
    try {
      setSaving(productId);
      setErrorMessage('');
      
      console.log('🔄 Resetting product:', productId);
      
      const result = await adminAPI.resetProduct(productId);
      
      if (!result.success) {
        throw new Error(result.message || 'Reset failed');
      }
      
      console.log('✅ Product reset successfully');
      
      await fetchProducts();
      
      setSuccessMessage('Product reset to default!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('❌ Failed to reset product:', error);
      setErrorMessage('Failed to reset: ' + error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setSaving(null);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-rubik">Manage Products</h1>
          <p className="text-gray-500 mt-1 font-montserrat text-sm">Update prices and stock availability</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const result = await adminAPI.debugDatabase();
                console.log('Database Debug:', result);
                if (result.success) {
                  setSuccessMessage(`DB Connected: ${result.database.name}, ${result.overrides.count} overrides stored`);
                  setTimeout(() => setSuccessMessage(''), 5000);
                }
              } catch (err) {
                setErrorMessage('Debug failed: ' + err.message);
              }
            }}
            className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-montserrat text-sm"
          >
            🔍 Debug
          </button>
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-montserrat text-sm"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 font-montserrat text-sm">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 font-montserrat text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-blue-700 text-sm font-montserrat">
            Update product prices (₹/kg) and toggle stock status. Changes are saved to database and reflect immediately on the website.
          </p>
        </div>
      </div>

      {/* Products by Category */}
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 font-rubik text-base sm:text-lg">{category}</h2>
            <p className="text-gray-500 text-xs sm:text-sm font-montserrat">{categoryProducts.length} products</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                saving={saving === product.id}
                onToggleStock={toggleStock}
                onPriceUpdate={handlePriceUpdate}
                onReset={resetProduct}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Individual Product Card Component
const ProductCard = ({ product, saving, onToggleStock, onPriceUpdate, onReset, formatCurrency }) => {
  const [priceInput, setPriceInput] = useState(product.pricePerKg.toString());
  const [isEditing, setIsEditing] = useState(false);

  // IMPORTANT: Update priceInput when product prop changes (after refetch)
  useEffect(() => {
    setPriceInput(product.pricePerKg.toString());
  }, [product.pricePerKg]);

  const handleSave = () => {
    onPriceUpdate(product, priceInput);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPriceInput(product.pricePerKg.toString());
    setIsEditing(false);
  };

  return (
    <div className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors">
      {/* Mobile Layout */}
      <div className="space-y-4">
        {/* Product Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 font-montserrat text-sm sm:text-base">
              {product.name}
            </h3>
            <p className="text-gray-500 text-xs font-montserrat mt-0.5">
              ID: {product.id}
              {product.hasOverride && (
                <span className="ml-2 text-primary font-medium">• Modified</span>
              )}
            </p>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 font-montserrat">
              Price per KG
            </label>
            {!isEditing && product.hasOverride && (
              <button
                onClick={() => onReset(product.id)}
                disabled={saving}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-montserrat">₹</span>
                <input
                  type="number"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-primary/30 rounded-lg text-base font-semibold font-montserrat focus:outline-none focus:border-primary"
                  placeholder="Price per kg"
                  autoFocus
                />
                <span className="text-gray-600 font-montserrat">/kg</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-primary text-white px-4 py-2.5 rounded-lg font-medium font-montserrat hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium font-montserrat hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-gray-800 font-rubik">
                  {formatCurrency(product.pricePerKg)}
                </span>
                <span className="text-gray-500 font-montserrat">/kg</span>
              </div>
              <div className="text-sm text-gray-600 font-montserrat mb-3">
                250gm = {formatCurrency(product.weightPrices['250gm'])} • 
                500gm = {formatCurrency(product.weightPrices['500gm'])} • 
                1kg = {formatCurrency(product.weightPrices['1kg'])}
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-white border-2 border-primary text-primary px-4 py-2.5 rounded-lg font-medium font-montserrat hover:bg-primary hover:text-white transition-colors"
              >
                Update Price
              </button>
            </div>
          )}
        </div>

        {/* Stock Toggle */}
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="text-sm font-medium text-gray-700 font-montserrat block mb-3">
            Stock Status
          </label>
          
          <button
            onClick={() => onToggleStock(product)}
            disabled={saving}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
              product.inStock 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-red-100 text-red-800 hover:bg-red-200'
            } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="flex items-center gap-2 font-montserrat">
              {product.inStock ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  In Stock
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5" />
                  Out of Stock
                </>
              )}
            </span>
            <span className="text-xs opacity-75">Tap to toggle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
