import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import io from 'socket.io-client';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  const initializeSocket = () => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    return newSocket;
  };

  // Create payment order
  const createPaymentOrder = async (amount, userId) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/payment/create-order', {
        amount,
        userId
      });
      
      if (response.data.success) {
        return response.data.order;
      }
    } catch (error) {
      console.error('Error creating payment order:', error);
      toast.error('Failed to create payment order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Process payment (dummy)
  const processPayment = async (orderId, amount) => {
    try {
      setLoading(true);
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.post('/api/payment/simulate-success', {
        orderId,
        amount
      });
      
      if (response.data.success) {
        return response.data.payment;
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create order
  const createOrder = async (userId, paymentData, deliveryAddress) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/orders/create', {
        userId,
        paymentData,
        deliveryAddress
      });
      
      if (response.data.success) {
        const order = response.data.order;
        setCurrentOrder(order);
        
        // Initialize socket for real-time updates
        const socketConnection = initializeSocket();
        
        // Emit order placed event
        socketConnection.emit('orderPlaced', {
          orderId: order.id,
          userId: order.userId
        });
        
        // Listen for delivery partner assignment
        socketConnection.on('deliveryPartnerAssigned', (data) => {
          if (data.orderId === order.id) {
            setCurrentOrder(prev => ({
              ...prev,
              deliveryPartner: data.partnerName,
              status: 'assigned'
            }));
            toast.success(`Delivery partner assigned: ${data.partnerName}`);
          }
        });
        
        toast.success('Order placed successfully!');
        return order;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error.response?.data?.message || 'Failed to create order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get order by ID
  const getOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${orderId}`);
      
      if (response.data.success) {
        return response.data.order;
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to fetch order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Track order
  const trackOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/${orderId}/track`);
      
      if (response.data.success) {
        return {
          order: response.data.order,
          tracking: response.data.tracking
        };
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error('Failed to track order');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user orders
  const getUserOrders = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/user/${userId}`);
      
      if (response.data.success) {
        setOrderHistory(response.data.orders);
        return response.data.orders;
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
      toast.error('Failed to fetch orders');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get payment methods
  const getPaymentMethods = async () => {
    try {
      const response = await axios.get('/api/payment/methods');
      
      if (response.data.success) {
        return response.data.methods;
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to fetch payment methods');
      throw error;
    }
  };

  // Complete checkout process
  const completeCheckout = async (cartData, deliveryAddress, paymentMethod) => {
    try {
      // Step 1: Create payment order
      const paymentOrder = await createPaymentOrder(cartData.finalAmount, cartData.userId);
      
      // Step 2: Process payment (dummy)
      const paymentResult = await processPayment(paymentOrder.id, cartData.finalAmount);
      
      // Step 3: Create order
      const order = await createOrder(cartData.userId, paymentResult, deliveryAddress);
      
      return order;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  };

  // Cleanup socket connection
  const cleanupSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const value = {
    currentOrder,
    orderHistory,
    loading,
    socket,
    createPaymentOrder,
    processPayment,
    createOrder,
    getOrder,
    trackOrder,
    getUserOrders,
    getPaymentMethods,
    completeCheckout,
    initializeSocket,
    cleanupSocket,
    setCurrentOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};