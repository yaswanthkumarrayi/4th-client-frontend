import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Loader2,
  Ticket,
  Calendar,
  Percent,
  Package,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    applicableProducts: '',
    validUntil: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getCoupons();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: '',
      maxDiscountAmount: '',
      applicableProducts: '',
      validUntil: ''
    });
    setEditingCoupon(null);
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        description: coupon.description || '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount || '',
        maxDiscountAmount: coupon.maxDiscountAmount || '',
        applicableProducts: coupon.applicableProducts?.join(', ') || '',
        validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      code: formData.code.toUpperCase(),
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
      maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
      applicableProducts: formData.applicableProducts 
        ? formData.applicableProducts.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
        : [],
      validUntil: formData.validUntil
    };

    try {
      setSaving(true);
      if (editingCoupon) {
        await adminAPI.updateCoupon(editingCoupon._id, data);
      } else {
        await adminAPI.createCoupon(data);
      }
      await fetchCoupons();
      closeModal();
    } catch (error) {
      console.error('Failed to save coupon:', error);
      alert(error.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const toggleCoupon = async (id) => {
    try {
      await adminAPI.toggleCoupon(id);
      await fetchCoupons();
    } catch (error) {
      console.error('Failed to toggle coupon:', error);
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await adminAPI.deleteCoupon(id);
      await fetchCoupons();
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-rubik">Coupons</h1>
          <p className="text-gray-500 mt-1 font-montserrat text-sm">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium font-montserrat text-sm hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      {/* Coupons List */}
      <div className="grid gap-4">
        {coupons.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 font-montserrat">
            No coupons created yet
          </div>
        ) : (
          coupons.map((coupon) => (
            <div 
              key={coupon._id} 
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${
                !coupon.isActive || isExpired(coupon.validUntil) ? 'opacity-60' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Coupon Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>

                {/* Coupon Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xl text-gray-800 font-mono">{coupon.code}</span>
                    {!coupon.isActive && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-montserrat">
                        Inactive
                      </span>
                    )}
                    {isExpired(coupon.validUntil) && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full font-montserrat">
                        Expired
                      </span>
                    )}
                  </div>
                  {coupon.description && (
                    <p className="text-gray-500 text-sm font-montserrat mt-1">{coupon.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 font-montserrat">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" />
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% off` 
                        : `₹${coupon.discountValue} off`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Until {formatDate(coupon.validUntil)}
                    </span>
                    {coupon.minOrderAmount > 0 && (
                      <span>Min: ₹{coupon.minOrderAmount}</span>
                    )}
                    <span>Used: {coupon.usedCount || 0}x</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleCoupon(coupon._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      coupon.isActive 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={coupon.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {coupon.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => openModal(coupon)}
                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 font-rubik">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-montserrat">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SAVE20"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-montserrat uppercase"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-montserrat">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Get 20% off on pickles"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-montserrat"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-montserrat">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-montserrat"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-montserrat">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? 'e.g., 20' : 'e.g., 100'}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-montserrat"
                    required
                  />
                </div>
              </div>

              {/* Min/Max Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-montserrat">
                    Min Order Amount
                  </label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    placeholder="e.g., 500"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-montserrat"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-montserrat">
                    Max Discount
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                    placeholder="e.g., 200"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-montserrat"
                  />
                </div>
              </div>

              {/* Applicable Products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-montserrat">
                  Applicable Product IDs (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.applicableProducts}
                  onChange={(e) => setFormData({ ...formData, applicableProducts: e.target.value })}
                  placeholder="e.g., 1, 2, 3 (leave empty for all)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-montserrat"
                />
                <p className="text-xs text-gray-500 mt-1 font-montserrat">
                  Leave empty to apply to all products
                </p>
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-montserrat">
                  Valid Until *
                </label>
                <input
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-montserrat"
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium font-montserrat hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-medium font-montserrat hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingCoupon ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
