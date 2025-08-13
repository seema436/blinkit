import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, MapPin, Phone } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

const OrderTracking = () => {
  const { orderId } = useParams();
  const { trackOrder } = useOrder();
  
  const [orderData, setOrderData] = useState(null);
  const [trackingSteps, setTrackingSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tracking information
  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        const data = await trackOrder(orderId);
        setOrderData(data.order);
        setTrackingSteps(data.tracking);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
        setError('Failed to load tracking information');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
    
    // Refresh tracking data every 30 seconds
    const interval = setInterval(fetchTrackingData, 30000);
    
    return () => clearInterval(interval);
  }, [orderId, trackOrder]);

  // Get step icon based on status
  const getStepIcon = (status, completed) => {
    const iconMap = {
      'placed': Package,
      'confirmed': CheckCircle,
      'assigned': Truck,
      'picked': Package,
      'delivered': CheckCircle
    };
    
    const IconComponent = iconMap[status] || Package;
    return <IconComponent size={20} />;
  };

  // Get estimated delivery time
  const getEstimatedDeliveryTime = () => {
    if (!orderData) return '';
    
    const orderTime = new Date(orderData.createdAt);
    const estimatedTime = new Date(orderTime.getTime() + 30 * 60000); // Add 30 minutes
    
    return estimatedTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error || !orderData) {
    return (
      <div className="container">
        <div className="empty-state">
          <Package size={80} style={{ opacity: 0.5 }} />
          <h2>Unable to track order</h2>
          <p>{error || 'Order not found'}</p>
          <Link to="/" className="checkout-btn">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="order-tracking" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Track Your Order</h1>
        
        {/* Order Info Header */}
        <div className="delivery-info mb-3">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3>Order #{orderData.orderNumber}</h3>
              <p className="text-muted">Placed on {new Date(orderData.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p><strong>Estimated Delivery:</strong></p>
              <p className="text-green" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                {getEstimatedDeliveryTime()}
              </p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="delivery-info mb-3">
          <div style={{ 
            padding: '1.5rem', 
            background: orderData.status === 'delivered' ? '#f0f9f0' : '#fff3cd',
            border: `2px solid ${orderData.status === 'delivered' ? '#0c7b00' : '#ffc107'}`,
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {orderData.status === 'delivered' ? '🎉' : '📦'}
            </div>
            <h3>
              {orderData.status === 'delivered' 
                ? 'Order Delivered!' 
                : `Order ${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}`}
            </h3>
            {orderData.deliveryPartner && (
              <p className="text-muted">
                Delivery Partner: <strong>{orderData.deliveryPartner}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Tracking Steps */}
        <div className="delivery-info">
          <h3>Order Progress</h3>
          <div className="tracking-steps">
            {trackingSteps.map((step, index) => (
              <div 
                key={step.status} 
                className={`tracking-step ${step.completed ? 'completed' : ''} ${
                  !step.completed && index === trackingSteps.findIndex(s => !s.completed) ? 'active' : ''
                }`}
              >
                <div className={`step-icon ${step.completed ? 'completed' : step.status === orderData.status ? 'active' : 'pending'}`}>
                  {getStepIcon(step.status, step.completed)}
                </div>
                <div className="step-details">
                  <h4>{step.message}</h4>
                  <p>{new Date(step.timestamp).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Partner Info */}
        {orderData.deliveryPartner && (
          <div className="delivery-info">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} />
              Delivery Partner
            </h3>
            <div style={{ 
              padding: '1rem', 
              background: '#f8f9fa', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <p><strong>{orderData.deliveryPartner}</strong></p>
                <p className="text-muted">Your delivery partner</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="checkout-btn" 
                  style={{ 
                    padding: '0.5rem 1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                  onClick={() => alert('Calling feature would be implemented with real phone integration')}
                >
                  <Phone size={16} />
                  Call
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Address */}
        <div className="delivery-info">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} />
            Delivery Address
          </h3>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <p><strong>{orderData.deliveryAddress.fullName}</strong></p>
            <p>{orderData.deliveryAddress.address}</p>
            {orderData.deliveryAddress.landmark && (
              <p className="text-muted">Near {orderData.deliveryAddress.landmark}</p>
            )}
            <p>{orderData.deliveryAddress.city}, {orderData.deliveryAddress.state} - {orderData.deliveryAddress.pincode}</p>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="delivery-info">
          <h3>Order Items ({orderData.items.length})</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {orderData.items.map(item => (
              <div key={item.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '0.75rem 0',
                borderBottom: '1px solid #eee'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: '#f8f9fa', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    📦
                  </div>
                  <div>
                    <p style={{ fontWeight: '500' }}>{item.product.name}</p>
                    <p className="text-muted">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span style={{ fontWeight: '500' }}>₹{item.totalPrice}</span>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span>Total Amount Paid:</span>
              <span className="text-green">₹{orderData.finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
          <button 
            className="checkout-btn"
            onClick={() => window.location.reload()}
            style={{ flex: '1', maxWidth: '200px' }}
          >
            <Clock size={16} style={{ marginRight: '0.5rem' }} />
            Refresh Status
          </button>
          
          <Link 
            to="/" 
            className="checkout-btn"
            style={{ 
              textDecoration: 'none', 
              background: 'transparent', 
              color: '#0c7b00', 
              border: '2px solid #0c7b00',
              flex: '1',
              maxWidth: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Continue Shopping
          </Link>
        </div>

        {/* Help Section */}
        <div className="delivery-info" style={{ textAlign: 'center' }}>
          <h4>Need Help?</h4>
          <p className="text-muted">
            If you have any questions about your order, please contact our support team.
          </p>
          <button 
            className="checkout-btn"
            style={{ 
              background: 'transparent', 
              color: '#0c7b00', 
              border: '2px solid #0c7b00',
              marginTop: '1rem'
            }}
            onClick={() => alert('Support chat feature would be implemented')}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;