import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('shopez_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopez_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product._id);
      
      if (existingItem) {
        // Limit quantity to product stock if available
        const newQty = existingItem.quantity + quantity;
        const finalQty = product.stock !== undefined ? Math.min(newQty, product.stock) : newQty;
        
        return prevItems.map(item =>
          item.productId === product._id
            ? { ...item, quantity: finalQty }
            : item
        );
      }

      const discountedPrice = Math.round(product.price * (1 - product.discount / 100));
      return [
        ...prevItems,
        {
          productId: product._id,
          title: product.title,
          price: product.price,
          discountedPrice: discountedPrice,
          discount: product.discount,
          image: product.image,
          quantity: Math.min(quantity, product.stock || 1),
          stock: product.stock
        }
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.stock || 99) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const originalTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountedTotal = cartItems.reduce((acc, item) => acc + item.discountedPrice * item.quantity, 0);
  const totalSavings = originalTotal - discountedTotal;
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      originalTotal,
      discountedTotal,
      totalSavings,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
