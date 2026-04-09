import { useState, useEffect } from 'react';
import { X, Loader2, MapPin, User, Phone, Building, Globe, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from './CheckoutContext';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { userAPI } from '../services/api';

const CheckoutModal = () => {
  const navigate = useNavigate();
  const { user, getToken } = useAuth();
  const { cartItems, subtotal } = useCart();
  const {
    isCheckoutOpen,
    closeCheckout,
    loading,
    error,
    initiatePayment,
    validateCoupon,
    removeCoupon,
    couponCode,
    setCouponCode,
    appliedCoupon,
    discount,
    deliveryCharge,
    total
  } = useCheckout();

  const [address, setAddress] = useState({
    name: '',
    mobile: '',
    address: '',
    state: '',
    country: 'India',
    pincode: ''
  });

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const token = await getToken();
        if (!token) return;

        const response = await userAPI.getProfile(token);
        if (response.success && response.user) {
          setAddress({
            name: response.user.name || '',
            mobile: response.user.mobileNumber || '',
            address: response.user.address || '',
            state: response.user.state || '',
            country: response.user.country || 'India',
            pincode: response.user.pincode || ''
          });
        }
      } catch (err) {
        // Failed to load profile silently
      }
    };

    if (isCheckoutOpen) {
      loadProfile();
    }
  }, [isCheckoutOpen, user, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    setCouponLoading(true);
    setCouponError('');
    
    const result = await validateCoupon(couponInput.trim());
    
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponInput('');
    }
    
    setCouponLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await initiatePayment(address);
    
    // If payment initiated, pass navigate for redirect after success
    if (result.success) {
      // Payment handler will use navigate to redirect after verification
      window.ordersNavigate = navigate;
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCheckout}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-rubik font-bold text-xl text-gray-800">Checkout</h2>
          <button
            onClick={closeCheckout}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-montserrat">
                {error}
              </div>
            )}

            {/* Order Summary */}
            <div>
              <h3 className="font-rubik font-semibold text-gray-800 mb-3">Order Summary</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.weight}`} className="flex justify-between text-sm font-montserrat">
                    <span className="text-gray-600">
                      {item.name} ({item.weight}) × {item.quantity}
                    </span>
                    <span className="text-gray-800 font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div>
              <h3 className="font-rubik font-semibold text-gray-800 mb-3">Coupon Code</h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                  <div>
                    <span className="text-green-700 font-medium font-montserrat">{appliedCoupon.code}</span>
                    <span className="text-green-600 text-sm font-montserrat ml-2">- ₹{discount} off</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 text-sm font-montserrat"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-montserrat text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-montserrat text-sm font-medium disabled:opacity-50"
                  >
                    {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
              )}
              {appliedCoupon && (
                <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-400 rounded-xl animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    <p className="text-green-700 text-sm font-montserrat font-medium">Coupon applied successfully</p>
                  </div>
                </div>
              )}
              {couponError && (
                <p className="text-red-500 text-xs mt-1 font-montserrat">{couponError}</p>
              )}
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="font-rubik font-semibold text-gray-800 mb-3">Delivery Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-montserrat text-sm"
                  />
                </div>

                {/* Mobile */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="mobile"
                    value={address.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number *"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-montserrat text-sm"
                  />
                </div>

                {/* Address - Full Width */}
                <div className="relative sm:col-span-2">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    name="address"
                    value={address.address}
                    onChange={handleChange}
                    placeholder="Full Address *"
                    required
                    rows={2}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-montserrat text-sm resize-none"
                  />
                </div>

                {/* State */}
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="State *"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-montserrat text-sm"
                  />
                </div>

                {/* Pincode */}
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    placeholder="Pincode *"
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary font-montserrat text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm font-montserrat">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm font-montserrat">
                  <span className="text-green-600">Discount</span>
                  <span className="text-green-600">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-montserrat">
                <span className="text-gray-600">Delivery</span>
                <span className="text-gray-800">
                  {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-rubik">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-xl text-primary">₹{total}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-montserrat shadow-lg shadow-primary/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${total}`
              )}
            </button>

            {/* Secure Payment Note */}
            <p className="text-center text-xs text-gray-500 font-montserrat">
              🔒 Secure payment powered by Razorpay
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
