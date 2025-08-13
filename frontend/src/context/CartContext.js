import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Mock user ID (in real app, get from authentication)
  const userId = 'user_123';

  // Fetch cart data
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/cart/${userId}`);
      if (response.data.success) {
        setCart(response.data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/cart/${userId}/add`, {
        productId: product.id,
        quantity
      });
      
      if (response.data.success) {
        setCart(response.data.cart);
        toast.success(`${product.name} added to cart!`);
        return true;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/cart/${userId}/update`, {
        productId,
        quantity
      });
      
      if (response.data.success) {
        setCart(response.data.cart);
        return true;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/cart/${userId}/remove/${productId}`);
      
      if (response.data.success) {
        setCart(response.data.cart);
        toast.success('Item removed from cart');
        return true;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/cart/${userId}/clear`);
      
      if (response.data.success) {
        setCart(response.data.cart);
        return true;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart?.totalItems || 0;
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cart?.items?.some(item => item.productId === productId) || false;
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cart?.items?.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  // Load cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cart,
    loading,
    userId,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartItemCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};