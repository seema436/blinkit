import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(30 * 60); // 30 minutes in seconds
  const [socket, setSocket] = useState(null);
  const userId = 'user123';

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Listen for order confirmation
    newSocket.on('orderConfirmed', (data) => {
      console.log('Order confirmed:', data);
      // You can update order status here if needed
    });

    // Listen for order status updates
    newSocket.on('orderStatusUpdate', (data) => {
      console.log('Order status update:', data);
      // Update order status in real-time
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    let timer;
    if (currentOrder && deliveryTime > 0) {
      timer = setInterval(() => {
        setDeliveryTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentOrder, deliveryTime]);

  const placeOrder = async (deliveryAddress) => {
    try {
      // Create payment order first
      const paymentResponse = await axios.post('/api/payment/create-order', {
        amount: currentOrder.total
      });

      // Simulate payment success (in real app, this would be handled by Razorpay)
      const paymentId = `pay_${Date.now()}`;

      // Place the order
      const orderResponse = await axios.post('/api/orders/place', {
        userId,
        paymentId,
        deliveryAddress
      });

      setCurrentOrder(orderResponse.data);
      setDeliveryTime(30 * 60); // Reset timer to 30 minutes

      return orderResponse.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  const getOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  };

  const getUserOrders = async () => {
    try {
      const response = await axios.get(`/api/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const value = {
    currentOrder,
    setCurrentOrder,
    deliveryTime,
    formatTime,
    placeOrder,
    getOrderDetails,
    getUserOrders,
    socket
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};