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
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setUpdating(true);
      await adminAPI.updateOrderStatus(orderId, status);
      await fetchOrders();
      if (selectedOrder?.orderId === orderId) {
        const data = await adminAPI.getOrder(orderId);
        setSelectedOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
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
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      out_for_delivery: 'bg-orange-100 text-orange-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { value: 'processing', label: 'Processing', icon: Package },
    { value: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: X }
  ];

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
        {['all', 'pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium font-montserrat transition-colors ${
              filter === status 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : status.replace('_', ' ')}
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

              {/* Update Status */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 font-montserrat">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => updateStatus(selectedOrder.orderId, value)}
                      disabled={updating || selectedOrder.orderStatus === value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium font-montserrat transition-colors ${
                        selectedOrder.orderStatus === value
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
