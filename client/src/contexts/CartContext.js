import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;
    case 'ADD_ITEM':
      return action.payload;
    case 'UPDATE_ITEM':
      return action.payload;
    case 'REMOVE_ITEM':
      return action.payload;
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const userId = 'user123'; // In a real app, this would come from authentication

  // Load cart from server on component mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await axios.get(`/api/cart/${userId}`);
        dispatch({ type: 'SET_CART', payload: response.data });
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };
    loadCart();
  }, [userId]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post('/api/cart/add', {
        userId,
        productId,
        quantity
      });
      dispatch({ type: 'ADD_ITEM', payload: response.data });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await axios.put('/api/cart/update', {
        userId,
        productId,
        quantity
      });
      dispatch({ type: 'UPDATE_ITEM', payload: response.data });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`/api/cart/remove/${userId}/${productId}`);
      dispatch({ type: 'REMOVE_ITEM', payload: response.data });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};