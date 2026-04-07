/**
 * Order Status Constants
 * Single source of truth for order status values
 * MUST be kept in sync with backend
 */

export const ORDER_STATUS = [
  'pending',
  'confirmed', 
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled'
];

export const PAYMENT_STATUS = [
  'pending',
  'paid',
  'failed',
  'refunded'
];

// Human-readable labels
export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

// Status colors for UI
export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

export const PAYMENT_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700'
};

// Status validation helper - handles undefined, null, and non-string values
export const isValidOrderStatus = (status) => {
  // Handle undefined, null, and non-string cases
  if (status === undefined || status === null || typeof status !== 'string') {
    return false;
  }
  
  // Normalize and check
  const normalized = status.trim().toLowerCase();
  
  // Check for literal 'undefined' or 'null' strings
  if (normalized === 'undefined' || normalized === 'null' || normalized === '') {
    return false;
  }
  
  return ORDER_STATUS.includes(normalized);
};

export const isValidPaymentStatus = (status) => {
  if (status === undefined || status === null || typeof status !== 'string') {
    return false;
  }
  return PAYMENT_STATUS.includes(status.trim().toLowerCase());
};

export default ORDER_STATUS;
