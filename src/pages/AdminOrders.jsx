import { useState, useEffect } from 'react';
import { X, Package, Truck, CheckCircle } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../data/orderStatus';

// Strict 3-step progression only
const STEPS = [
  { value: 'processing',       label: 'Processing',       icon: Package },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { value: 'delivered',        label: 'Delivered',        icon: CheckCircle },
];

const getStepIndex = (status) => STEPS.findIndex((s) => s.value === status);

const AdminOrders = () => {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating]           = useState(false);

  useEffect(() => { fetchOrders(); }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getOrders({ status: filter });
      if (data.success) setOrders(data.orders);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, status) => {
    try {
      setUpdating(true);
      const result = await adminAPI.updateOrderStatus(orderId, status);
      if (!result.success) { alert('Failed: ' + result.message); return; }
      await fetchOrders();
      if (selectedOrder?.orderId === orderId) {
        const d = await adminAPI.getOrder(orderId);
        if (d.success) setSelectedOrder(d.order);
      }
    } catch (e) { alert('Failed: ' + e.message); }
    finally { setUpdating(false); }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const getStatusColor = (status) => ({
    pending:          'bg-[#fef9c3] text-[#854d0e]',
    processing:       'bg-[#dbeafe] text-[#1e40af]',
    out_for_delivery: 'bg-[#fef3c7] text-[#92400e]',
    delivered:        'bg-[#dcfce7] text-[#166534]',
    cancelled:        'bg-[#fee2e2] text-[#dc2626]',
  }[status] || 'bg-gray-100 text-gray-700');

  const filterOptions = ['all', 'pending', ...STEPS.map((s) => s.value)];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="pb-4 border-b border-[#e5e7eb]">
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filterOptions.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors min-h-[40px] ${
              filter === s ? 'bg-[#7B0D1E] text-white' : 'bg-white text-gray-600 border border-[#e5e7eb] hover:bg-gray-50'
            }`}>
            {s === 'all' ? 'All' : ORDER_STATUS_LABELS[s] || s.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  {['Order ID','Customer','Items','Amount','Status','Date','Action'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono bg-[#fef3c7] text-[#854d0e] px-2 py-1 rounded">{order.orderId}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-900">{order.customer?.name}</p>
                      <p className="text-xs text-gray-400">{order.customer?.mobile}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {order.items?.[0]?.name}
                      {order.items?.length > 1 && <span className="text-gray-400"> +{order.items.length - 1} more</span>}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelectedOrder(order)}
                        className="text-xs font-medium bg-[#7B0D1E] text-white px-3 py-2 rounded-lg hover:bg-[#5a0010] transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />)
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No orders found</div>
        ) : orders.map((order) => (
          <div key={order.orderId} className="bg-white rounded-xl border border-[#e5e7eb] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono bg-[#fef3c7] text-[#854d0e] px-2 py-1 rounded">{order.orderId}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus?.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{order.customer?.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>
              <p className="text-sm font-semibold text-[#7B0D1E]">{formatCurrency(order.totalAmount)}</p>
            </div>
            <p className="text-xs text-gray-500">
              {order.items?.[0]?.name}{order.items?.length > 1 && ` +${order.items.length - 1} more`}
            </p>
            <button onClick={() => setSelectedOrder(order)}
              className="w-full bg-[#7B0D1E] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#5a0010] transition-colors min-h-[44px]">
              Update Status
            </button>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-white rounded-t-2xl md:rounded-xl w-full md:max-w-lg max-h-[92vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-[#e5e7eb] px-5 py-4 flex items-center justify-between rounded-t-2xl md:rounded-t-xl">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Order Details</h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{selectedOrder.orderId}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* Customer */}
              <div className="bg-[#f9fafb] rounded-xl p-4 space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Customer</p>
                <p className="text-sm font-medium text-gray-900">{selectedOrder.customer?.name}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customer?.mobile}</p>
                {selectedOrder.customer?.email && <p className="text-sm text-gray-500">{selectedOrder.customer?.email}</p>}
                <p className="text-sm text-gray-500">
                  {selectedOrder.customer?.address}, {selectedOrder.customer?.state} – {selectedOrder.customer?.pincode}
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Items Ordered</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#f9fafb] rounded-xl p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.weight} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border border-[#e5e7eb] rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Coupon ({selectedOrder.couponCode})</span>
                    <span className="text-green-600">−{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span>{selectedOrder.deliveryCharge === 0 ? 'Free' : formatCurrency(selectedOrder.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-[#e5e7eb]">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#7B0D1E]">{formatCurrency(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              {/* ── Strict 3-Step Progression ── */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Update Status</p>

                {/* Progress tracker */}
                <div className="flex items-center mb-5">
                  {STEPS.map(({ value, label }, idx) => {
                    const currentIdx = getStepIndex(selectedOrder.orderStatus);
                    const isPending  = selectedOrder.orderStatus === 'pending';
                    const isDone     = !isPending && idx < currentIdx;
                    const isCurrent  = !isPending && idx === currentIdx;
                    return (
                      <div key={value} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                            isDone    ? 'bg-[#7B0D1E] border-[#7B0D1E] text-white' :
                            isCurrent ? 'bg-[#7B0D1E] border-[#7B0D1E] text-white' :
                                        'bg-white border-gray-200 text-gray-300'
                          }`}>
                            {isDone ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={`text-[10px] mt-1 text-center leading-tight max-w-[52px] ${
                            isCurrent ? 'text-[#7B0D1E] font-semibold' :
                            isDone    ? 'text-gray-400' : 'text-gray-300'
                          }`}>{label}</span>
                        </div>
                        {idx < STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 mb-4 ${
                            !isPending && idx < currentIdx ? 'bg-[#7B0D1E]' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons — only next step is active */}
                <div className="space-y-2">
                  {/* Pending → Processing starter */}
                  {selectedOrder.orderStatus === 'pending' && (
                    <button
                      onClick={() => updateStatus(selectedOrder.orderId, 'processing')}
                      disabled={updating}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-white border border-[#7B0D1E] text-[#7B0D1E] hover:bg-[#7B0D1E] hover:text-white transition-colors min-h-[48px] disabled:opacity-50">
                      <Package className="w-4 h-4" />
                      <span className="flex-1 text-left">Start Processing</span>
                      <span className="text-xs opacity-60">Mark as →</span>
                    </button>
                  )}

                  {STEPS.map(({ value, label, icon: Icon }, idx) => {
                    const currentIdx = getStepIndex(selectedOrder.orderStatus);
                    const isPending  = selectedOrder.orderStatus === 'pending';
                    if (isPending) return null; // handled above

                    const isDone     = idx < currentIdx;
                    const isCurrent  = idx === currentIdx;
                    const isNext     = idx === currentIdx + 1;
                    const isFuture   = idx > currentIdx + 1;

                    return (
                      <button
                        key={value}
                        onClick={() => isNext && !updating && updateStatus(selectedOrder.orderId, value)}
                        disabled={!isNext || updating}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[48px] ${
                          isDone    ? 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed' :
                          isCurrent ? 'bg-[#7B0D1E] border-[#7B0D1E] text-white cursor-default' :
                          isNext    ? 'bg-white border border-[#7B0D1E] text-[#7B0D1E] hover:bg-[#7B0D1E] hover:text-white cursor-pointer' :
                                      'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed'
                        }`}>
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-left">{label}</span>
                        {isDone    && <span className="text-xs">Done</span>}
                        {isCurrent && <span className="text-xs opacity-70">Current</span>}
                        {isNext    && <span className="text-xs opacity-60">Mark as →</span>}
                        {isFuture  && <span className="text-xs opacity-40">Locked</span>}
                      </button>
                    );
                  })}
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