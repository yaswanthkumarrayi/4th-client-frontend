import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product, weight, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && item.weight === weight
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.weight === weight
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          weight,
          price: product.weightPrices?.[weight] || product.price,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, weight, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id, weight);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.weight === weight
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeItem = (id, weight) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.weight === weight))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        openCart,
        closeCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
