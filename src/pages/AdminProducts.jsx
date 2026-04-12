import { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(null);
  const [editingPrice, setEditingPrice] = useState(null);
  const [priceInput, setPriceInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getProducts();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, updateData) => {
    const numericProductId = Number(productId);
    if (isNaN(numericProductId) || numericProductId <= 0) {
      alert('Error: Invalid product ID');
      return;
    }
    const cleanedData = {};
    if (updateData.pricePerKg !== undefined && updateData.pricePerKg !== '') {
      const price = Number(updateData.pricePerKg);
      if (!isNaN(price) && price > 0) cleanedData.pricePerKg = price;
    }
    if ('inStock' in updateData) {
      cleanedData.inStock = updateData.inStock === true || updateData.inStock === 'true';
    }
    if (Object.keys(cleanedData).length === 0) {
      alert('Error: No valid fields to update');
      return;
    }
    try {
      setSaving(numericProductId);
      const result = await adminAPI.updateProduct(numericProductId, cleanedData);
      if (!result.success) throw new Error(result.message || 'Update failed');
      await fetchProducts();
    } catch (error) {
      alert('Failed to update: ' + error.message);
    } finally {
      setSaving(null);
    }
  };

  const toggleStock = async (product) => {
    const productId = Number(product.id || product.productId);
    if (isNaN(productId) || productId <= 0) {
      alert('Error: Invalid product ID');
      return;
    }
    await updateProduct(productId, { inStock: !product.inStock });
  };

  const handlePriceUpdate = async (productId, newPrice) => {
    const pricePerKg = parseInt(newPrice, 10);
    if (isNaN(pricePerKg) || pricePerKg <= 0) {
      alert('Please enter a valid price (must be a positive number)');
      return;
    }
    await updateProduct(Number(productId), { pricePerKg });
    setEditingPrice(null);
  };

  const formatCurrency = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

  // Build category list dynamically from products
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const categoryTabs = ['all', ...categories];

  // Filter by category + search
  const visibleProducts = products.filter((p) => {
    const matchCat = filter === 'all' || p.category === filter;
    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search);
    return matchCat && matchSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-[#e5e7eb]">
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="pb-4 border-b border-[#e5e7eb]">
        <h1 className="text-xl font-semibold text-gray-900">Products</h1>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or ID..."
        className="w-full md:w-72 h-10 px-4 border border-[#e5e7eb] rounded-lg text-sm focus:ring-2 focus:ring-[#7B0D1E] focus:border-transparent outline-none"
      />

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categoryTabs.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors min-h-[40px] ${
              filter === cat
                ? 'bg-[#7B0D1E] text-white'
                : 'bg-white text-gray-600 border border-[#e5e7eb] hover:bg-gray-50'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Products Grid — 2 columns, no images */}
      {visibleProducts.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              saving={saving === product.id}
              editingPrice={editingPrice}
              priceInput={priceInput}
              onToggleStock={toggleStock}
              onPriceUpdate={handlePriceUpdate}
              onEditPrice={(id, price) => {
                setEditingPrice(id);
                setPriceInput(price.toString());
              }}
              onCancelEdit={() => setEditingPrice(null)}
              onPriceInputChange={setPriceInput}
              formatCurrency={formatCurrency}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCard = ({
  product,
  saving,
  editingPrice,
  priceInput,
  onToggleStock,
  onPriceUpdate,
  onEditPrice,
  onCancelEdit,
  onPriceInputChange,
  formatCurrency,
}) => {
  const isEditing = editingPrice === product.id;

  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
      {/* Card Body */}
      <div className="p-3 space-y-2">
        {/* Product ID — highlighted */}
        <span className="text-xs font-mono bg-[#fef3c7] text-[#854d0e] px-2 py-0.5 rounded inline-block">
          #{product.id}
        </span>

        {/* Name */}
        <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
          {product.name}
        </p>

        {/* Category */}
        <p className="text-xs text-gray-400">{product.category}</p>

        {/* Price Row */}
        <div className="flex items-center gap-1 pt-1">
          {isEditing ? (
            <div className="flex items-center gap-1 w-full">
              <input
                type="number"
                value={priceInput}
                onChange={(e) => onPriceInputChange(e.target.value)}
                className="w-full px-2 py-1 border border-[#e5e7eb] rounded text-xs focus:ring-2 focus:ring-[#7B0D1E] focus:border-transparent outline-none"
                autoFocus
              />
              <button
                onClick={() => onPriceUpdate(product.id, priceInput)}
                disabled={saving}
                className="p-1.5 text-[#16a34a] hover:bg-green-50 rounded disabled:opacity-50 flex-shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-1.5 text-[#dc2626] hover:bg-red-50 rounded flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <p className="text-sm font-bold text-[#7B0D1E]">
                {formatCurrency(product.pricePerKg)}
                <span className="text-xs font-normal text-gray-400"> /kg</span>
              </p>
              <button
                onClick={() => onEditPrice(product.id, product.pricePerKg)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stock Toggle — bottom strip */}
      <div className="border-t border-[#e5e7eb] px-3 py-2.5">
        <button
          onClick={() => onToggleStock(product)}
          disabled={saving}
          className={`w-full flex items-center justify-between text-xs font-semibold py-1.5 px-2 rounded-lg transition-colors disabled:opacity-50 min-h-[36px] ${
            product.inStock
              ? 'bg-green-50 text-[#16a34a]'
              : 'bg-red-50 text-[#dc2626]'
          }`}
        >
          <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
          {/* Toggle pill */}
          <div
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
              product.inStock ? 'bg-[#16a34a]' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                product.inStock ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminProducts;