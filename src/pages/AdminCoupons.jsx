import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Percent, IndianRupee, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';

const EMPTY_FORM = {
  code:               '',
  description:        '',
  discountType:       'percentage',
  discountValue:      '',
  minOrderAmount:     '',
  maxDiscountAmount:  '',
  applicableProducts: '',
  validUntil:         '',
};

const AdminCoupons = () => {
  const [coupons, setCoupons]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showForm, setShowForm]         = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving]             = useState(false);
  const [formData, setFormData]         = useState(EMPTY_FORM);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getCoupons();
      if (data.success) setCoupons(data.coupons);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openForm = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code:               coupon.code,
        description:        coupon.description || '',
        discountType:       coupon.discountType,
        discountValue:      coupon.discountValue,
        minOrderAmount:     coupon.minOrderAmount || '',
        maxDiscountAmount:  coupon.maxDiscountAmount || '',
        applicableProducts: coupon.applicableProducts?.join(', ') || '',
        validUntil:         coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : '',
      });
    } else {
      setEditingCoupon(null);
      setFormData(EMPTY_FORM);
    }
    setShowForm(true);
    // scroll form into view on mobile
    setTimeout(() => document.getElementById('coupon-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const closeForm = () => { setShowForm(false); setEditingCoupon(null); setFormData(EMPTY_FORM); };

  const set = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      code:               formData.code.toUpperCase(),
      description:        formData.description,
      discountType:       formData.discountType,
      discountValue:      parseFloat(formData.discountValue),
      minOrderAmount:     formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
      maxDiscountAmount:  formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
      applicableProducts: formData.applicableProducts
        ? formData.applicableProducts.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
        : [],
      validUntil: formData.validUntil,
    };
    try {
      setSaving(true);
      if (editingCoupon) await adminAPI.updateCoupon(editingCoupon._id, payload);
      else await adminAPI.createCoupon(payload);
      await fetchCoupons();
      closeForm();
    } catch (e) { alert(e.message || 'Failed to save coupon'); }
    finally { setSaving(false); }
  };

  const toggleCoupon = async (id) => {
    try { await adminAPI.toggleCoupon(id); await fetchCoupons(); } catch (e) { console.error(e); }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try { await adminAPI.deleteCoupon(id); await fetchCoupons(); } catch (e) { console.error(e); }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const isExpired = (date) => new Date(date) < new Date();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-[#e5e7eb]">
          <h1 className="text-xl font-semibold text-gray-900">Coupons</h1>
        </div>
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="pb-4 border-b border-[#e5e7eb] flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Coupons</h1>
        {!showForm && (
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 bg-[#7B0D1E] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#5a0010] transition-colors min-h-[40px]">
            <Plus className="w-4 h-4" />
            Add Coupon
          </button>
        )}
      </div>

      {/* ── Inline Add / Edit Form ── */}
      {showForm && (
        <div id="coupon-form" className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
          {/* Form Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
            <h2 className="text-sm font-semibold text-gray-900">
              {editingCoupon ? 'Edit Coupon' : 'New Coupon'}
            </h2>
            <button onClick={closeForm} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Code + Type row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Coupon Code *</label>
                <input type="text" required
                  value={formData.code}
                  onChange={(e) => set('code', e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE20"
                  className="w-full h-10 px-3 border border-[#e5e7eb] rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-[#7B0D1E] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Discount Type</label>
                <select value={formData.discountType} onChange={(e) => set('discountType', e.target.value)}
                  className="w-full h-10 px-3 border border-[#e5e7eb] rounded-lg text-sm focus:ring-2 focus:ring-[#7B0D1E] focus:border-transparent outline-none bg-white">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Flat Amount (₹)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Description</label>
              <input type="text"
                value={formData.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="e.g. Get 20% off on all pickles"
                className="w-full h-10 px-3 border border-[#e5e7eb] rounded-lg text-sm focus:ring-2 focus:ring-[#7B0D1E] focus:border-transparent outline-none" />
            </div>

            {/* Value + Min + Max */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  {formData.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'} *
                </label>
                <input type="number" required min="1"
                  value={formData.discountValue}
                  onChange={(e) => set('discountValue', e.target.value)}
                  placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                  className="w-full h-10 px-3 border border-[#e5e7eb] rounded-lg text-sm focus:ring-2 focus:ring-[#7B0D1E] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Min Order ₹</label>
                <input type="number" min="0"
                  value={formData.minOrderAmount}
                  onChange={(e) => set('minOrderAmount', e.target.value)}
                  placeholder="500"
                  className="w-full h-10 px-3 border border-[#e5e7eb] rounded-lg text-sm focus:ring-2 focus:ring-[#7B0D1E] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Max Discount ₹</label>
                <input type="number" min="0"
                  value={formData.maxDiscountAmount}
                  onChange={(e) => set('maxDiscountAmount', e.target.value)}
                  placeholder="200"
                  className="w-full h-10 px-3 border border-[#e5e7eb] rounded-lg text-sm focus:ring-2 focus:ring-[#7B0D1E] focus:border-transparent outline-none" />
              </div>
            </div>

            {/* Product IDs + Valid Until */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Product IDs</label>
                <input type="text"
                  value={formData.applicableProducts}
                  onChange={(e) => set('applicableProducts', e.target.value)}
                  placeholder="1, 2, 3 — leave empty for all"
                  className="w-full h-10 px-3 border border-[#e5e7eb] rounded-lg text-sm focus:ring-2 focus:ring-[#7B0D1E] focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Valid Until *</label>
                <input type="datetime-local" required
                  value={formData.validUntil}
                  onChange={(e) => set('validUntil', e.target.value)}
                  className="w-full h-10 px-3 border border-[#e5e7eb] rounded-lg text-sm focus:ring-2 focus:ring-[#7B0D1E] focus:border-transparent outline-none" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={closeForm}
                className="flex-1 h-11 border border-[#e5e7eb] text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 h-11 bg-[#7B0D1E] text-white text-sm font-medium rounded-lg hover:bg-[#5a0010] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingCoupon ? 'Update Coupon' : 'Save Coupon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Coupons List ── */}
      {coupons.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-12 text-center text-gray-400 text-sm">
          No coupons yet. Add your first coupon above.
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => {
            const expired  = isExpired(coupon.validUntil);
            const inactive = !coupon.isActive;
            return (
              <div key={coupon._id}
                className={`bg-white rounded-xl border border-[#e5e7eb] p-4 transition-opacity ${inactive || expired ? 'opacity-60' : ''}`}>

                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Code badge */}
                    <span className="font-mono font-bold text-sm bg-[#fef3c7] text-[#854d0e] px-3 py-1 rounded-lg">
                      {coupon.code}
                    </span>
                    {/* Status badges */}
                    {expired ? (
                      <span className="text-xs font-medium bg-[#fee2e2] text-[#dc2626] px-2 py-0.5 rounded-full">Expired</span>
                    ) : inactive ? (
                      <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                    ) : (
                      <span className="text-xs font-medium bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full">Active</span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {/* Toggle active */}
                    <button onClick={() => toggleCoupon(coupon._id)}
                      title={coupon.isActive ? 'Deactivate' : 'Activate'}
                      className={`p-2 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                        coupon.isActive ? 'bg-green-50 text-[#16a34a] hover:bg-green-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}>
                      {coupon.isActive
                        ? <ToggleRight className="w-4 h-4" />
                        : <ToggleLeft className="w-4 h-4" />}
                    </button>
                    {/* Edit */}
                    <button onClick={() => openForm(coupon)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {/* Delete */}
                    <button onClick={() => deleteCoupon(coupon._id)}
                      className="p-2 bg-[#fee2e2] text-[#dc2626] rounded-lg hover:bg-[#fecaca] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {coupon.description && (
                  <p className="text-xs text-gray-500 mt-2">{coupon.description}</p>
                )}

                {/* Details row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-medium text-[#7B0D1E]">
                    {coupon.discountType === 'percentage'
                      ? <><Percent className="w-3 h-3" />{coupon.discountValue}% off</>
                      : <><IndianRupee className="w-3 h-3" />₹{coupon.discountValue} off</>
                    }
                  </span>
                  {coupon.minOrderAmount > 0 && (
                    <span>Min order ₹{coupon.minOrderAmount}</span>
                  )}
                  {coupon.maxDiscountAmount && (
                    <span>Max ₹{coupon.maxDiscountAmount}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Until {formatDate(coupon.validUntil)}
                  </span>
                  <span className="text-gray-400">Used {coupon.usedCount || 0}×</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;