import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, User, Package, MapPin } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { getOrder, currentOrder, setCurrentOrder } = useOrder();
  
  const [order, setOrder] = useState(null);
  const [timer, setTimer] = useState(30); // 30 seconds timer
  const [deliveryPartner, setDeliveryPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (currentOrder && currentOrder.id === orderId) {
          setOrder(currentOrder);
        } else {
          const orderData = await getOrder(orderId);
          setOrder(orderData);
          setCurrentOrder(orderData);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, currentOrder, getOrder, setCurrentOrder]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Listen for delivery partner assignment from socket
  useEffect(() => {
    if (currentOrder && currentOrder.deliveryPartner && !deliveryPartner) {
      setDeliveryPartner(currentOrder.deliveryPartner);
    }
  }, [currentOrder, deliveryPartner]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Order not found</h2>
          <p>The order you're looking for doesn't exist.</p>
          <Link to="/" className="checkout-btn">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="order-confirmation">
        {/* Success Message */}
        <div className="success-icon">
          <CheckCircle size={80} />
        </div>
        
        <h1>Order Placed Successfully!</h1>
        <p className="text-muted">Thank you for your order. We're preparing it for delivery.</p>
        
        {/* Order Number */}
        <div className="order-number">
          Order Number: {order.orderNumber}
        </div>

        {/* Timer */}
        {timer > 0 && (
          <div className="timer">
            <Clock size={24} style={{ marginRight: '0.5rem' }} />
            Your order will be delivered in approximately {formatTime(timer)} minutes
          </div>
        )}

        {timer === 0 && (
          <div className="timer" style={{ background: 'linear-gradient(135deg, #0c7b00, #0a6600)' }}>
            <Package size={24} style={{ marginRight: '0.5rem' }} />
            Your order is being prepared for delivery!
          </div>
        )}

        {/* Delivery Partner Info */}
        <div className="delivery-info">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <User size={20} />
            Delivery Information
          </h3>
          
          {deliveryPartner ? (
            <div style={{ padding: '1rem', background: '#f0f9f0', borderRadius: '8px', border: '1px solid #0c7b00' }}>
              <p><strong>Delivery Partner:</strong> {deliveryPartner}</p>
              <p className="text-muted">Your delivery partner has been assigned and will contact you shortly.</p>
            </div>
          ) : (
            <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
              <p><strong>Status:</strong> Assigning delivery partner...</p>
              <p className="text-muted">We're finding the best delivery partner for your order.</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="delivery-info">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Package size={20} />
            Order Summary
          </h3>
          
          <div className="order-items">
            {order.items.map(item => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '0.5rem 0',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <span>{item.product.name}</span>
                  <span className="text-muted"> x {item.quantity}</span>
                </div>
                <span>₹{item.totalPrice}</span>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>₹{order.totalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Delivery Fee:</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total Amount:</span>
              <span>₹{order.finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="delivery-info">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <MapPin size={20} />
            Delivery Address
          </h3>
          
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <p><strong>{order.deliveryAddress.fullName}</strong></p>
            <p>{order.deliveryAddress.address}</p>
            {order.deliveryAddress.landmark && (
              <p className="text-muted">Near {order.deliveryAddress.landmark}</p>
            )}
            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
            <p className="text-muted">Phone: {order.deliveryAddress.phone}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
          <Link 
            to={`/track-order/${order.id}`} 
            className="checkout-btn"
            style={{ textDecoration: 'none', flex: '1', maxWidth: '200px' }}
          >
            Track Order
          </Link>
          
          <Link 
            to="/" 
            className="checkout-btn"
            style={{ 
              textDecoration: 'none', 
              background: 'transparent', 
              color: '#0c7b00', 
              border: '2px solid #0c7b00',
              flex: '1',
              maxWidth: '200px'
            }}
          >
            Continue Shopping
          </Link>
        </div>

        {/* Order Timeline */}
        <div className="delivery-info">
          <h3>What happens next?</h3>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: '#0c7b00', marginRight: '0.5rem' }}>✓</span>
              <span>Order confirmed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: deliveryPartner ? '#0c7b00' : '#ccc', marginRight: '0.5rem' }}>
                {deliveryPartner ? '✓' : '○'}
              </span>
              <span>Delivery partner assigned</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: '#ccc', marginRight: '0.5rem' }}>○</span>
              <span>Order picked up</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#ccc', marginRight: '0.5rem' }}>○</span>
              <span>Order delivered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;