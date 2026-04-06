import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { orderAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Import images from src/assets
import AvakayaPickle from '../assets/images/VegPickles/Avakaya1.png';
import LemonPickle from '../assets/images/VegPickles/LemonPickle.png';
import GonguraPickle from '../assets/images/VegPickles/Gongura1.png';
import TomatoPickle from '../assets/images/VegPickles/TomatoPickle.png';
import RedChilliPickle from '../assets/images/VegPickles/RedChilliPickle.png';
import ChickenPickle from '../assets/images/NonVegPickles/Chicken1.png';
import MuttonPickle from '../assets/images/NonVegPickles/MuttonPickle.png';
import KaramPodi from '../assets/images/Podis/KandiPodi.png';
import MysorePak from '../assets/images/Sweets/MysoreaPak.png';
import Mixture from '../assets/images/Snacks/Mixture.png';

// Image map for product name lookup
const imageMap = {
  'avakaya pickle': AvakayaPickle,
  'avakaya': AvakayaPickle,
  'mango pickle': AvakayaPickle,
  'lemon pickle': LemonPickle,
  'gongura pickle': GonguraPickle,
  'gongura': GonguraPickle,
  'tomato pickle': TomatoPickle,
  'red chilli pickle': RedChilliPickle,
  'chicken pickle': ChickenPickle,
  'mutton pickle': MuttonPickle,
  'karam podi': KaramPodi,
  'kandi podi': KaramPodi,
  'mysore pak': MysorePak,
  'mysorepak': MysorePak,
  'mixture': Mixture,
};

// Helper to get image from map
const getProductImage = (name) => {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  return imageMap[key] || null;
};

// Product Image Component with smooth loading
const ProductImage = ({ name, alt, image }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // First try image from order, then fallback to name mapping
  const imageSrc = image || getProductImage(name);

  return (
    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
      {!loaded && !error && (
        <div className="w-full h-full animate-pulse bg-gray-200" />
      )}
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={alt || name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            setLoaded(true);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-400 text-xs text-center px-1">{name?.substring(0, 10)}</span>
        </div>
      )}
    </div>
  );
};

// Track Order Modal (Card Overlay) - Improved UI/UX
const TrackOrderModal = ({ order, onClose }) => {
  const trackingSteps = [
    { id: 'confirmed', label: 'Order Confirmed', description: 'Your order has been placed successfully' },
    { id: 'processing', label: 'Processing', description: 'Your order is being prepared' },
    { id: 'out_for_delivery', label: 'Out for Delivery', description: 'Your order is on its way' },
    { id: 'delivered', label: 'Delivered', description: 'Your order has been delivered' },
  ];

  const getStepStatus = (stepId) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.orderStatus);
    const stepIndex = statusOrder.indexOf(stepId);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Card - Improved positioning */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slideUp">
        {/* Sticky Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800 font-rubik">Track Order</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order Info Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-xs text-gray-500 font-montserrat uppercase tracking-wide">Order ID</p>
                <p className="text-base font-semibold text-gray-800 font-rubik mt-1">#{order.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-montserrat uppercase tracking-wide">Order Date</p>
                <p className="text-sm font-medium text-gray-800 font-montserrat mt-1">{formatDate(order.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Timeline - Compact */}
          <div className="space-y-0">
            <h3 className="text-sm font-semibold text-gray-800 font-rubik mb-4">Delivery Status</h3>
            <div className="relative pl-6">
              {trackingSteps.map((step, index) => {
                const status = getStepStatus(step.id);
                const isLast = index === trackingSteps.length - 1;

                return (
                  <div key={step.id} className="relative pb-6 last:pb-0">
                    {/* Timeline dot - positioned absolutely */}
                    <div className="absolute -left-8 top-0 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          status === 'completed'
                            ? 'bg-green-600 text-white shadow-lg'
                            : status === 'active'
                            ? 'bg-green-700 text-white ring-4 ring-green-200 shadow-lg'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {status === 'completed' ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-1 h-16 mt-1 ${
                            status === 'completed' ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="pb-2">
                      <h4
                        className={`text-sm font-semibold font-rubik ${
                          status === 'pending' ? 'text-gray-400' : 'text-gray-800'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p
                        className={`text-xs font-montserrat mt-1 ${
                          status === 'pending' ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      >
                        {step.description}
                      </p>
                      {status === 'active' && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items Section */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-semibold text-gray-800 font-rubik mb-3">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <ProductImage name={item.name} alt={item.name} image={item.image} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 font-rubik truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 font-montserrat">{item.weight} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800 font-montserrat flex-shrink-0">₹{item.total}</p>
                </div>
              ))}
            </div>

            {/* Total Amount - Sticky */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-700 font-rubik">Total Amount</span>
              <span className="text-lg font-bold text-green-700 font-montserrat">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyOrders = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <p className="text-lg font-semibold text-[#800000]">
      No Orders yet
    </p>
  </div>
);

// Order Card Component
const OrderCard = ({ order, onReorder, onDelete, onTrack, activeMenu, toggleMenu }) => {
  const navigate = useNavigate();

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700',
    confirmed: 'bg-blue-50 text-blue-700',
    processing: 'bg-purple-50 text-purple-700',
    out_for_delivery: 'bg-orange-50 text-orange-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  const statusLabels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  // Parse items safely
  let items = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
  } catch {
    items = order.items || [];
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Order Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-montserrat">Order #{order.orderId}</p>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${statusColors[order.orderStatus] || statusColors.pending}`}>
            {statusLabels[order.orderStatus] || order.orderStatus}
          </span>
        </div>

        {/* 3 Dot Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu(order._id)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-lg font-bold leading-none">⋮</span>
          </button>

          {activeMenu === order._id && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => toggleMenu(null)} />
              <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-md w-40 z-20 border border-gray-100 overflow-hidden">
                <button
                  onClick={() => {
                    onTrack(order);
                    toggleMenu(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-montserrat"
                >
                  Track Order
                </button>

                {order.orderStatus === 'delivered' && (
                  <button
                    onClick={() => {
                      onDelete(order);
                      toggleMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-montserrat border-t border-gray-100"
                  >
                    Delete Order
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Items - Compact Layout */}
      <div className="p-4">
        {items && items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {/* Product Image - LEFT (with smooth loading) */}
                <ProductImage name={item.name} alt={item.name} image={item.image} />

                {/* Product Details - CENTER */}
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm font-semibold text-gray-800 font-rubik cursor-pointer hover:text-green-700 transition-colors truncate"
                    onClick={() => item.productId && navigate(`/product/${item.productId}`)}
                  >
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-montserrat">{item.weight}</p>
                  <p className="text-xs text-gray-500 font-montserrat">Qty: {item.quantity}</p>
                </div>

                {/* Price - RIGHT */}
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-gray-800 font-montserrat">
                    ₹{item.total || (item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 font-montserrat">No items</p>
        )}

        {/* Action Buttons - Side by Side (both green) */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => onTrack(order)}
            className="flex-1 px-4 py-2 text-sm bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors font-medium font-montserrat"
          >
            Track Order
          </button>

          <button
            onClick={() => onReorder(order)}
            className="flex-1 px-4 py-2 text-sm border border-green-700 text-green-700 rounded-md hover:bg-green-50 transition-colors font-medium font-montserrat"
          >
            Reorder
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Orders Component
const Orders = () => {
  const { user, loading: authLoading, getToken } = useAuth();
  const navigate = useNavigate();

  // Fetch real orders from API
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch user orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        
        const token = await getToken();
        if (!token) {
          throw new Error('Authentication failed');
        }

        const response = await orderAPI.getMyOrders(token);
        
        if (response.success) {
          setOrders(response.orders || []);
        } else {
          throw new Error(response.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Fetch orders error:', err);
        setError(err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, getToken]);

  const toggleMenu = (orderId) => {
    setActiveMenu(activeMenu === orderId ? null : orderId);
  };

  const handleTrack = (order) => {
    setTrackingOrder(order);
  };

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      const firstProduct = order.items[0];
      if (firstProduct.productId) {
        navigate(`/product/${firstProduct.productId}`);
      }
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication failed');
      }

      const response = await orderAPI.deleteOrder(token, order.orderId);
      
      if (response.success) {
        // Remove from list
        setOrders(orders.filter(o => o._id !== order._id));
      } else {
        throw new Error(response.message || 'Failed to delete order');
      }
    } catch (err) {
      console.error('Delete order error:', err);
      alert(err.message || 'Failed to delete order');
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen w-full bg-[url('/Background2.avif')] bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center pt-16">
          <Loader2 className="w-8 h-8 animate-spin text-green-700" />
        </div>
        <Footer />
      </>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />

      {/* Page Background - Background2.avif */}
      <div className="min-h-screen w-full bg-[url('/Background2.avif')] bg-cover bg-center bg-no-repeat bg-fixed">

        {/* Content Container */}
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">

            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <span className="text-2xl font-bold">&lt;</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800 font-rubik">
                Your Orders
              </h1>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-montserrat">
                {error}
              </div>
            )}

            {/* Orders List */}
            <div className="space-y-4">
              {orders.length === 0 ? (
                <EmptyOrders />
              ) : (
                orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onTrack={handleTrack}
                    onReorder={handleReorder}
                    onDelete={handleDelete}
                    activeMenu={activeMenu}
                    toggleMenu={toggleMenu}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Track Order Modal */}
      {trackingOrder && (
        <TrackOrderModal
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </>
  );
};

export default Orders;
