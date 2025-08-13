import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import { FaCheckCircle, FaTruck, FaClock } from 'react-icons/fa';

const OrderSummary = () => {
  const { orderId } = useParams();
  const { getOrderDetails } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading order details...</h2>
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="order-summary">
      <div className="order-header">
        <FaCheckCircle className="order-success" />
        <h1>Order Confirmed!</h1>
        <p className="order-id">Order ID: {order.id}</p>
      </div>

      <div className="order-details">
        <h3 style={{ marginBottom: '1rem' }}>Order Details</h3>
        {order.items.map((item) => (
          <div key={item.productId} className="order-item">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.total}</span>
          </div>
        ))}
        <div className="order-total">
          <span>Total: ₹{order.total}</span>
        </div>
      </div>

      <div className="delivery-info">
        <h3 style={{ marginBottom: '1rem' }}>Delivery Information</h3>
        <p className="delivery-partner">
          <FaTruck style={{ marginRight: '0.5rem' }} />
          Delivery Partner: {order.deliveryPartner}
        </p>
        <p className="estimated-delivery">
          <FaClock style={{ marginRight: '0.5rem' }} />
          Estimated Delivery: {formatDate(order.estimatedDelivery)}
        </p>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          <strong>Delivery Address:</strong><br />
          {order.deliveryAddress.fullName}<br />
          {order.deliveryAddress.address}<br />
          {order.deliveryAddress.city} - {order.deliveryAddress.pincode}<br />
          Phone: {order.deliveryAddress.phone}
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: '#636e72', marginBottom: '1rem' }}>
          Your order will be delivered within 30 minutes!
        </p>
        <Link to={`/delivery-tracking/${order.id}`} className="track-order-btn">
          Track Your Order
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;