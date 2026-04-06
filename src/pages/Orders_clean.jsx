import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { orderAPI } from '../services/api';

// Empty State Component
const EmptyOrders = () => (
  <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-2xl mx-auto">
    <h3 className="text-2xl font-bold text-gray-800 font-rubik mb-3">No Orders Yet</h3>
    <p className="text-gray-500 font-montserrat mb-8 text-sm">
      You haven't placed any orders yet. Start shopping to see your orders here.
    </p>
    <a
      href="/"
      className="inline-block px-8 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-all font-montserrat text-sm"
    >
      Start Shopping
    </a>
  </div>
);

// Order Card Component
const OrderCard = ({ order, onDelete, activeMenu, toggleMenu, onReorder }) => {
  const navigate = useNavigate();
  const [showTracking, setShowTracking] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
    processing: 'bg-purple-50 text-purple-700 border border-purple-200',
    out_for_delivery: 'bg-orange-50 text-orange-700 border border-orange-200',
    delivered: 'bg-green-50 text-green-700 border border-green-200',
    cancelled: 'bg-red-50 text-red-700 border border-red-200',
  };

  const statusLabels = {
    pending: 'Payment Pending',
    confirmed: 'Order Confirmed',
    processing: 'Processing',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  const trackingSteps = [
    { id: 'confirmed', label: 'Order Confirmed' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
  ];

  // Get step status based on current order status
  const getStepStatus = (stepId) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.orderStatus);
    const stepIndex = statusOrder.indexOf(stepId);
    return stepIndex <= currentIndex ? 'completed' : 'pending';
  };

  // Parse items safely
  let items = [];
  try {
    items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
  } catch {
    items = order.items || [];
  }

  // Handle product click
  const handleProductClick = (productId) => {
    if (productId) navigate(`/product/${productId}`);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Order Header */}
      <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-sm font-semibold text-gray-800 font-rubik">
                Order #{order.orderId}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.orderStatus] || statusColors.pending}`}>
                {statusLabels[order.orderStatus] || order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-montserrat">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          {/* 3 Dot Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu(order._id)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Order options"
            >
              <span className="text-xl font-bold leading-none">⋮</span>
            </button>

            {activeMenu === order._id && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => toggleMenu(null)}
                />
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-44 z-20 border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => {
                      setShowTracking(!showTracking);
                      toggleMenu(null);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-montserrat transition-colors"
                  >
                    Track Order
                  </button>

                  {order.orderStatus === 'delivered' && (
                    <button
                      onClick={() => {
                        onDelete(order);
                        toggleMenu(null);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-montserrat border-t border-gray-100 transition-colors"
                    >
                      Delete Order
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-5">
        {items && items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                {/* Product Image */}
                <div
                  className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer bg-gray-50"
                  onClick={() => handleProductClick(item.productId)}
                >
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name || 'Product'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-base font-semibold text-gray-800 font-rubik cursor-pointer hover:text-green-700 transition-colors mb-1"
                    onClick={() => handleProductClick(item.productId)}
                  >
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-montserrat">
                    <span>{item.weight}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800 font-montserrat">
                    ₹{item.total || (item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 font-montserrat">No items in this order</p>
        )}

        {/* Order Summary */}
        <div className="mt-6 pt-5 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-montserrat">Subtotal</span>
            <span className="text-gray-800 font-montserrat">₹{order.subtotal || order.totalAmount}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-montserrat">Discount</span>
              <span className="text-green-600 font-montserrat">-₹{order.discount}</span>
            </div>
          )}
          {order.deliveryCharge > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-montserrat">Delivery Charge</span>
              <span className="text-gray-800 font-montserrat">₹{order.deliveryCharge}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 border-t border-gray-100">
            <span className="text-base font-semibold text-gray-800 font-rubik">Total Amount</span>
            <span className="text-xl font-bold text-green-700 font-montserrat">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Tracking Section */}
        {showTracking && (
          <div className="mt-6 pt-5 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 font-rubik mb-4">Order Status</h4>
            <div className="space-y-4">
              {trackingSteps.map((step, index) => {
                const stepStatus = getStepStatus(step.id);
                return (
                  <div key={step.id} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      stepStatus === 'completed' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {stepStatus === 'completed' ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium font-montserrat ${
                        stepStatus === 'completed' ? 'text-gray-800' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-5 border-t border-gray-200">
          <button
            onClick={() => setShowTracking(!showTracking)}
            className="flex-1 px-5 py-2.5 text-sm text-green-700 border border-green-700 rounded-lg font-medium font-montserrat hover:bg-green-50 transition-colors"
          >
            {showTracking ? 'Hide Tracking' : 'Track Order'}
          </button>

          <button
            onClick={() => onReorder(order)}
            className="flex-1 px-5 py-2.5 text-sm bg-green-700 text-white rounded-lg font-medium font-montserrat hover:bg-green-800 transition-colors"
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

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await orderAPI.getMyOrders(token);

        if (response.success && response.orders) {
          setOrders(response.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError(error.message || 'Failed to load orders');
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
      const response = await orderAPI.deleteOrder(token, order.orderId);

      if (response.success) {
        setOrders(orders.filter(o => o._id !== order._id));
      } else {
        alert(response.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert(error.message || 'Failed to delete order');
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen w-full bg-[url('/Background2.avif')] bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center pt-16">
          <Loader2 className="w-10 h-10 animate-spin text-green-700" />
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

      {/* Page Background - Full visibility */}
      <div className="min-h-screen w-full bg-[url('/Background2.avif')] bg-cover bg-center bg-no-repeat bg-fixed">

        {/* Content Container */}
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">

            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 font-rubik">
                Your Orders
              </h1>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg mb-6">
                <p className="font-semibold font-rubik">Error loading orders</p>
                <p className="text-sm font-montserrat mt-1">{error}</p>
              </div>
            )}

            {/* Orders List */}
            <div className="space-y-6">
              {orders.length === 0 ? (
                <EmptyOrders />
              ) : (
                orders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
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
    </>
  );
};

export default Orders;
