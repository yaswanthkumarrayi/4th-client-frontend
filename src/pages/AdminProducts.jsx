import { useState, useEffect } from 'react';
import { 
  Package, 
  Edit2, 
  Save, 
  X, 
  RotateCcw,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getProducts();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditData({
      pricePerKg: product.pricePerKg,
      inStock: product.inStock
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveProduct = async (productId) => {
    try {
      setSaving(true);
      await adminAPI.updateProduct(productId, editData);
      await fetchProducts();
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setSaving(false);
    }
  };

  const resetProduct = async (productId) => {
    if (!confirm('Reset this product to default values?')) return;
    
    try {
      setSaving(true);
      await adminAPI.resetProduct(productId);
      await fetchProducts();
    } catch (error) {
      console.error('Failed to reset product:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleStock = async (product) => {
    try {
      setSaving(true);
      await adminAPI.updateProduct(product.id, {
        inStock: !product.inStock
      });
      await fetchProducts();
    } catch (error) {
      console.error('Failed to toggle stock:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-rubik">Products</h1>
        <p className="text-gray-500 mt-1 font-montserrat text-sm">Manage prices and stock status</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-blue-700 text-sm font-montserrat">
          <strong>Note:</strong> Products are hardcoded. You can only update prices and stock status here. 
          Changes are stored as overrides.
        </p>
      </div>

      {/* Products by Category */}
      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 font-rubik">{category}</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {categoryProducts.map((product) => (
              <div key={product.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Product Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 font-montserrat text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-gray-500 text-xs font-montserrat">
                        ID: {product.id}
                        {product.hasOverride && (
                          <span className="ml-2 text-primary">(Modified)</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Price & Stock */}
                  <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    {editingId === product.id ? (
                      <>
                        {/* Edit Mode */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500 font-montserrat">₹/kg:</label>
                          <input
                            type="number"
                            value={editData.pricePerKg}
                            onChange={(e) => setEditData({ ...editData, pricePerKg: parseInt(e.target.value) || 0 })}
                            className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-montserrat focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500 font-montserrat">In Stock:</label>
                          <button
                            onClick={() => setEditData({ ...editData, inStock: !editData.inStock })}
                            className={`w-12 h-6 rounded-full transition-colors ${
                              editData.inStock ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                              editData.inStock ? 'translate-x-6' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => saveProduct(product.id)}
                            disabled={saving}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* View Mode */}
                        <div className="text-right">
                          <p className="font-semibold text-gray-800 font-montserrat text-sm">
                            {formatCurrency(product.pricePerKg)}/kg
                          </p>
                          <p className="text-gray-500 text-xs font-montserrat">
                            250gm: {formatCurrency(product.weightPrices['250gm'])}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => toggleStock(product)}
                          disabled={saving}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium font-montserrat ${
                            product.inStock 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.inStock ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              In Stock
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Out of Stock
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(product)}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {product.hasOverride && (
                            <button
                              onClick={() => resetProduct(product.id)}
                              disabled={saving}
                              className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                              title="Reset to default"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;
