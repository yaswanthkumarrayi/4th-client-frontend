import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { orderAPI } from '../services/api';

// Order Card Component
const OrderCard = ({ order, onDelete, activeMenu, toggleMenu }) => {
  const navigate = useNavigate();
  const [showTracking, setShowTracking] = useState(false);

  const statusColors = {
    pending: 'text-yellow-600',
    confirmed: 'text-blue-600',
    processing: 'text-blue-600',
    out_for_delivery: 'text-orange-600',
    delivered: 'text-green-600',
    cancelled: 'text-red-600',
  };

  const statusLabels = {
    pending: 'Payment Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  const trackingSteps = [
    { label: 'Order Confirmed', status: 'confirmed' },
    { label: 'Out for Delivery', status: 'out_for_delivery' },
    { label: 'Delivered', status: 'delivered' },
  ];

  const getStepStatus = (stepStatus) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.orderStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    return stepIndex <= currentIndex;
  };

  // Parse items if it's a string
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
  const firstItem = items[0];

  // Safely get image
  const getImageUrl = () => {
    if (!firstItem) return '/placeholder.jpg';
    if (typeof firstItem.image === 'string') {
      try {
        const parsed = JSON.parse(firstItem.image);
        return parsed.url || parsed || '/placeholder.jpg';
      } catch {
        return firstItem.image || '/placeholder.jpg';
      }
    }
    return firstItem.image || '/placeholder.jpg';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-500">Order #{order.orderId}</p>
          <p className={`text-sm font-medium ${statusColors[order.orderStatus]}`}>
            {statusLabels[order.orderStatus]}
          </p>
        </div>

        {/* 3 Dot Menu */}
        <div className="relative">
          <button
            onClick={() => toggleMenu(order._id)}
            className="p-1 text-gray-600 hover:text-gray-800"
            aria-label="Order options"
          >
            <span className="text-lg font-bold">⋮</span>
          </button>

          {activeMenu === order._id && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => toggleMenu(null)} />
              <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-lg w-40 z-20 border border-gray-200">
                <button
                  onClick={() => {
                    setShowTracking(!showTracking);
                    toggleMenu(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Track Order
                </button>

                {order.orderStatus === 'delivered' && (
                  <button
                    onClick={() => {
                      onDelete(order);
                      toggleMenu(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                  >
                    Delete Order
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Order Items */}
      {firstItem && (
        <div className="px-4 py-3 flex items-center gap-4">
          {/* Product Image */}
          <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
            <img
              src={getImageUrl()}
              alt={firstItem.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder.jpg';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-800 truncate">{firstItem.name}</h4>
            <p className="text-xs text-gray-500">{firstItem.weight}</p>
            <p className="text-xs text-gray-500">Qty: {firstItem.quantity}</p>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <p className="text-base font-bold text-gray-800">₹{firstItem.total || firstItem.price}</p>
          </div>
        </div>
      )}

      {/* Tracking Section */}
      {showTracking && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-700 mb-3">Order Status</p>
          <div className="space-y-2">
            {trackingSteps.map((step, idx) => {
              const isCompleted = getStepStatus(step.status);
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                    isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <p className={`text-xs ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => setShowTracking(!showTracking)}
          className="flex-1 text-xs px-3 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
        >
          {showTracking ? 'Hide' : 'Track'}
        </button>
        <button
          onClick={() => navigate(`/product/${firstItem?.productId}`)}
          className="flex-1 text-xs px-3 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors font-medium"
        >
          Reorder
        </button>
      </div>
    </div>
  );
};

// Main Orders Component
const Orders = () => {
  const { user, loading: authLoading, getToken } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await orderAPI.getMyOrders(token);
        setOrders(response.success && response.orders ? response.orders : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, getToken]);

  const toggleMenu = (orderId) => {
    setActiveMenu(activeMenu === orderId ? null : orderId);
  };

  const handleDelete = async (order) => {
    if (!window.confirm('Delete this order?')) return;

    try {
      const token = await getToken();
      const response = await orderAPI.deleteOrder(token, order.orderId);
      
      if (response.success) {
        setOrders(orders.filter(o => o._id !== order._id));
      } else {
        alert(response.message || 'Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete order');
    }
  };

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

  if (!user) return null;

  return (
    <>
      <Navbar />
      
      {/* Page */}
      <div className="min-h-screen w-full bg-[url('/Background2.avif')] bg-cover bg-center bg-no-repeat bg-fixed">
        
        {/* Content */}
        <div className="py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <span className="text-2xl font-bold">&lt;</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Your Orders</h1>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Empty State */}
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 mb-4">No orders yet</p>
                <a href="/" className="text-green-700 font-medium hover:underline text-sm">
                  Start shopping
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onDelete={handleDelete}
                    activeMenu={activeMenu}
                    toggleMenu={toggleMenu}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Orders;
