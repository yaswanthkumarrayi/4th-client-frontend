import { useState } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCheckout } from './CheckoutContext';

const CartDrawer = ({ isOpen, onClose, cartItems, updateQuantity, removeItem }) => {
  const { openCheckout } = useCheckout();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 499;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleBuyNow = () => {
    onClose();
    openCheckout();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] sm:w-1/2 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="font-rubik font-bold text-xl sm:text-2xl text-gray-800">YOUR CART</h2>
              <span className="text-gray-500 font-montserrat">({totalItems})</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-600 font-montserrat">Homemade & Authentic Foods</p>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-4 sm:px-6 py-4 bg-gray-50">
          {amountForFreeShipping > 0 ? (
            <p className="text-sm text-gray-600 font-montserrat text-center">
              Add items worth <span className="font-semibold text-primary">₹{amountForFreeShipping}</span> & Get Free Shipping
            </p>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold text-green-600 font-montserrat">₹{freeShippingThreshold}</span>
              <span className="text-sm text-green-600 font-montserrat">Free Shipping</span>
            </div>
          )}
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-montserrat">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.id}-${item.weight}`}
                className="flex gap-4 p-4 bg-gray-50 rounded-xl"
              >
                {/* Product Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-rubik font-semibold text-gray-800 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-montserrat">{item.weight}</p>
                  <p className="font-semibold text-gray-800 font-rubik mt-1">₹{item.price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-gray-600 font-montserrat">Quantity:</span>
                    <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.weight)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Trust Badge */}
        {cartItems.length > 0 && (
          <div className="px-4 sm:px-6 py-3 bg-yellow-100 text-center flex items-center justify-center">
            <p className="text-sm text-gray-800 font-montserrat font-medium">✨ Trusted By 10k+ Customers</p>
          </div>
        )}

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="font-montserrat text-gray-600">Estimated total</span>
              <span className="font-rubik font-bold text-xl text-gray-800">₹{subtotal}</span>
            </div>
            <button 
              onClick={handleBuyNow}
              className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors duration-300 font-montserrat"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
