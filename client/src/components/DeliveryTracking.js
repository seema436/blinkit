import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import { FaTruck, FaCheckCircle, FaClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const DeliveryTracking = () => {
  const { orderId } = useParams();
  const { getOrderDetails, deliveryTime, formatTime } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const deliverySteps = [
    {
      title: 'Order Confirmed',
      description: 'Your order has been confirmed and is being prepared',
      icon: '1'
    },
    {
      title: 'Order Prepared',
      description: 'Your items are being packed and prepared for delivery',
      icon: '2'
    },
    {
      title: 'Out for Delivery',
      description: 'Your delivery partner is on the way to deliver your order',
      icon: '3'
    },
    {
      title: 'Delivered',
      description: 'Your order has been successfully delivered',
      icon: '4'
    }
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderData = await getOrderDetails(orderId);
        setOrder(orderData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, getOrderDetails]);

  useEffect(() => {
    // Simulate delivery progress based on time
    const progressInterval = setInterval(() => {
      if (deliveryTime > 0) {
        const progress = Math.floor(((30 * 60 - deliveryTime) / (30 * 60)) * 4);
        setCurrentStep(Math.min(progress, 3));
      } else {
        setCurrentStep(3); // Delivered
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(progressInterval);
  }, [deliveryTime]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading delivery tracking...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Order not found</h2>
        <Link to="/" className="track-order-btn" style={{ marginTop: '1rem' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  const getDeliveryMessage = () => {
    if (deliveryTime <= 0) {
      return "Your order has been delivered! Thank you for shopping with us.";
    } else if (deliveryTime <= 5 * 60) {
      return "Your delivery partner is almost at your location!";
    } else if (deliveryTime <= 15 * 60) {
      return "Your delivery partner is on the way to deliver your order.";
    } else {
      return "Your order is being prepared and will be delivered soon.";
    }
  };

  return (
    <div className="delivery-tracking">
      <div className="tracking-header">
        <h1>Track Your Order</h1>
        <p style={{ color: '#636e72' }}>Order ID: {order.id}</p>
      </div>

      <div className="delivery-status">
        <div className="status-indicator"></div>
        <span className="status-text">
          {deliverySteps[currentStep].title}
        </span>
      </div>

      <div className="delivery-timer">
        <div className="timer-display">
          {deliveryTime > 0 ? formatTime(deliveryTime) : '00:00'}
        </div>
        <p style={{ color: '#636e72' }}>
          {deliveryTime > 0 ? 'Time remaining for delivery' : 'Order delivered!'}
        </p>
      </div>

      <div className="delivery-message">
        <p>{getDeliveryMessage()}</p>
      </div>

      <div className="delivery-progress">
        <h3 style={{ marginBottom: '1rem' }}>Delivery Progress</h3>
        {deliverySteps.map((step, index) => (
          <div key={index} className="progress-step">
            <div className={`step-icon ${index <= currentStep ? 'step-completed' : ''}`}>
              {index < currentStep ? <FaCheckCircle /> : step.icon}
            </div>
            <div className="step-text">
              <div className="step-title">{step.title}</div>
              <div className="step-description">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        background: '#f8f9fa', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginTop: '2rem' 
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Delivery Partner Details</h3>
        <p style={{ marginBottom: '0.5rem' }}>
          <FaUser style={{ marginRight: '0.5rem' }} />
          <strong>Name:</strong> {order.deliveryPartner}
        </p>
        <p style={{ marginBottom: '0.5rem' }}>
          <FaTruck style={{ marginRight: '0.5rem' }} />
          <strong>Status:</strong> {deliverySteps[currentStep].title}
        </p>
        <p>
          <FaMapMarkerAlt style={{ marginRight: '0.5rem' }} />
          <strong>Destination:</strong> {order.deliveryAddress.address}, {order.deliveryAddress.city}
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/" className="track-order-btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default DeliveryTracking;