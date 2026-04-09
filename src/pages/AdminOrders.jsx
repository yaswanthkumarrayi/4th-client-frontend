import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock,
  X,
  Loader2,
  Package
} from 'lucide-react';
import { adminAPI } from '../services/adminAPI';
import { 
  ORDER_STATUS,
  ADMIN_WORKFLOW_STATUS,
  ORDER_STATUS_LABELS, 
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS 
} from '../data/orderStatus';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getOrders({ status: filter });
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      // Failed to fetch orders silently
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    // Guard 1: Check if status exists and is a string
    if (!status || typeof status !== 'string') {
      alert('Error: Invalid status value. Please select a valid status.');
      return;
    }
    
    // Guard 2: Trim and normalize
    const normalizedStatus = status.trim().toLowerCase();
    
    // Guard 3: Check for empty string
    if (normalizedStatus === '') {
      alert('Error: Status cannot be empty.');
      return;
    }
    
    // Guard 4: Check for 'undefined' or 'null' as strings
    if (normalizedStatus === 'undefined' || normalizedStatus === 'null') {
      alert('Error: Status cannot be "undefined" or "null".');
      return;
    }
    
    // Guard 5: Validate against allowed statuses
    if (!ORDER_STATUS.includes(normalizedStatus)) {
      alert(`Error: "${status}" is not a valid status.\nValid values: ${ORDER_STATUS.join(', ')}`);
      return;
    }
    
    try {
      setUpdating(true);
      const result = await adminAPI.updateOrderStatus(orderId, normalizedStatus);
      
      if (!result.success) {
        alert('Failed to update status: ' + result.message);
        return;
      }
      
      // Refetch orders after successful update
      await fetchOrders();
      
      // Update selected order modal if open
      if (selectedOrder?.orderId === orderId) {
        const data = await adminAPI.getOrder(orderId);
        if (data.success) {
          setSelectedOrder(data.order);
        }
      }
    } catch (error) {
      alert('Failed to update status: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    return ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentColor = (status) => {
    return PAYMENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
  };

  // Status options for admin workflow - simplified 3-step process
  const statusOptions = [
    { value: 'processing', label: 'Processing', icon: Package },
    { value: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];
  
  // Handler for status button clicks - ensures status is NEVER undefined
  const handleStatusClick = (orderId, status) => {
    // Guard 1: Check basic validity
    if (!status || typeof status !== 'string' || status.trim() === '') {
      alert('Error: Cannot update status - invalid value detected');
      return;
    }
    
    // Guard 2: Check for string 'undefined' or 'null'
    const normalized = status.trim().toLowerCase();
    if (normalized === 'undefined' || normalized === 'null') {
      alert('Error: Invalid status value. Please refresh the page and try again.');
      return;
    }
    
    // Guard 3: Validate against allowed statuses
    if (!ORDER_STATUS.includes(normalized)) {
      alert(`Error: "${status}" is not a valid status.\nAllowed: ${ORDER_STATUS.join(', ')}`);
      return;
    }
    
    // All guards passed, proceed with update
    updateStatus(orderId, status);
  };

  // Filter options - use shared constants
  const filterOptions = ['all', ...ORDER_STATUS.filter(s => s !== 'cancelled')];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-rubik">Orders</h1>
          <p className="text-gray-500 mt-1 font-montserrat text-sm">Manage customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium font-montserrat transition-colors ${
              filter === status 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : ORDER_STATUS_LABELS[status] || status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-montserrat">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-montserrat">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-medium text-gray-800 font-montserrat text-sm">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-800 font-montserrat text-sm">{order.customer?.name}</p>
                        <p className="text-gray-500 text-xs font-montserrat">{order.customer?.mobile}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-500 font-montserrat text-sm hidden md:table-cell">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-800 font-montserrat text-sm">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.payment?.status)}`}>
                        {order.payment?.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-primary transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 font-rubik">Order {selectedOrder.orderId}</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 font-montserrat">Customer Details</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-gray-800 font-medium font-montserrat">{selectedOrder.customer?.name}</p>
                  <p className="text-gray-600 text-sm font-montserrat">{selectedOrder.customer?.mobile}</p>
                  <p className="text-gray-600 text-sm font-montserrat">{selectedOrder.customer?.email}</p>
                  <p className="text-gray-600 text-sm font-montserrat">
                    {selectedOrder.customer?.address}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 font-montserrat">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
                      <div>
                        <p className="font-medium text-gray-800 font-montserrat text-sm">{item.name}</p>
                        <p className="text-gray-500 text-xs font-montserrat">{item.weight} × {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800 font-montserrat text-sm">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm font-montserrat">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm font-montserrat">
                    <span className="text-gray-500">Discount ({selectedOrder.couponCode})</span>
                    <span className="text-green-600">-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-montserrat">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-gray-800">
                    {selectedOrder.deliveryCharge === 0 ? 'Free' : formatCurrency(selectedOrder.deliveryCharge)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold font-montserrat pt-2 border-t border-gray-100">
                  <span className="text-gray-800">Total</span>
                  <span className="text-primary">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* Email Tracking */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 font-montserrat">Email Notifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-montserrat ${
                    selectedOrder.emailsSent?.paymentConfirmation 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {selectedOrder.emailsSent?.paymentConfirmation ? '✅' : '⏳'} Payment Confirmation
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-montserrat ${
                    selectedOrder.emailsSent?.orderReceived 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {selectedOrder.emailsSent?.orderReceived ? '✅' : '⏳'} Order Received
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-montserrat ${
                    selectedOrder.emailsSent?.outForDelivery 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {selectedOrder.emailsSent?.outForDelivery ? '✅' : '⏳'} Out for Delivery
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-montserrat ${
                    selectedOrder.emailsSent?.delivered 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {selectedOrder.emailsSent?.delivered ? '✅' : '⏳'} Delivered
                  </div>
                </div>
              </div>

              {/* Update Status - Clean 3-Step Progress */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 font-montserrat">Order Progress</h3>
                
                {/* Mobile-Friendly 3-Step Progress Indicator */}
                <div className="mb-6">
                  {/* Progress Steps */}
                  <div className="relative flex items-start justify-between mb-8">
                    {/* Connecting Line Background */}
                    <div className="absolute top-6 sm:top-7 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }} />
                    
                    {statusOptions.map((status, index) => {
                      const Icon = status.icon;
                      const isActive = selectedOrder.orderStatus === status.value;
                      const isCompleted = 
                        (status.value === 'processing' && ['processing', 'out_for_delivery', 'delivered'].includes(selectedOrder.orderStatus)) ||
                        (status.value === 'out_for_delivery' && ['out_for_delivery', 'delivered'].includes(selectedOrder.orderStatus)) ||
                        (status.value === 'delivered' && selectedOrder.orderStatus === 'delivered');
                      const isPending = !isCompleted && !isActive;
                      
                      return (
                        <div key={status.value} className="flex flex-col items-center flex-1 relative" style={{ zIndex: 1 }}>
                          {/* Step Circle */}
                          <div className={`
                            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
                            transition-all duration-300 mb-2
                            ${isCompleted ? 'bg-green-500 text-white' : ''}
                            ${isActive ? 'bg-primary text-white ring-4 ring-primary/20' : ''}
                            ${isPending ? 'bg-gray-200 text-gray-400' : ''}
                          `}>
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          
                          {/* Step Label */}
                          <p className={`
                            text-xs sm:text-sm font-medium text-center font-montserrat max-w-[80px]
                            ${isCompleted || isActive ? 'text-gray-800' : 'text-gray-400'}
                          `}>
                            {status.label}
                          </p>
                          
                          {/* Active Progress Line Segment */}
                          {index < statusOptions.length - 1 && isCompleted && (
                            <div 
                              className="absolute top-6 sm:top-7 h-0.5 bg-green-500 transition-all duration-300"
                              style={{
                                left: '50%',
                                width: index === 0 ? 'calc(50% + 50%)' : '100%',
                                zIndex: 0
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Status Update Buttons */}
                <div className="space-y-2">
                  {statusOptions.map(({ value, label, icon: Icon }) => {
                    const isCurrentStatus = selectedOrder.orderStatus === value;
                    
                    return (
                      <button
                        key={value}
                        onClick={() => handleStatusClick(selectedOrder.orderId, value)}
                        disabled={updating || isCurrentStatus}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-xl
                          text-sm font-medium font-montserrat transition-all duration-200
                          ${isCurrentStatus 
                            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isCurrentStatus ? 'text-white' : 'text-gray-500'}`} />
                          <span>{label}</span>
                        </div>
                        {isCurrentStatus && (
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Current</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {/* Cancel Option (separated) */}
                {selectedOrder.orderStatus !== 'delivered' && selectedOrder.orderStatus !== 'cancelled' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this order?')) {
                          handleStatusClick(selectedOrder.orderId, 'cancelled');
                        }
                      }}
                      disabled={updating}
                      className="w-full px-4 py-2 rounded-lg text-sm font-medium font-montserrat bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
