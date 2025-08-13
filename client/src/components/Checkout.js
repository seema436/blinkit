import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useOrder } from '../contexts/OrderContext';

const Checkout = () => {
  const { cart } = useCart();
  const { setCurrentOrder, placeOrder } = useOrder();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'pincode'];
    const missingFields = requiredFields.filter(field => !deliveryAddress[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      // Set current order in context
      setCurrentOrder({
        items: cart.items,
        total: cart.total
      });

      // Place the order
      const order = await placeOrder(deliveryAddress);
      
      // Navigate to order summary
      navigate(`/order-summary/${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="checkout-container">
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2d3436' }}>
        Checkout
      </h1>

      <div className="checkout-form">
        <h2 style={{ marginBottom: '1.5rem' }}>Delivery Address</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={deliveryAddress.fullName}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={deliveryAddress.phone}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Address *</label>
            <textarea
              name="address"
              value={deliveryAddress.address}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your complete address"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">City *</label>
            <input
              type="text"
              name="city"
              value={deliveryAddress.city}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your city"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={deliveryAddress.pincode}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your pincode"
              required
            />
          </div>
        </form>
      </div>

      <div className="payment-section">
        <h2 style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
        <div style={{ marginBottom: '1.5rem' }}>
          {cart.items.map((item) => (
            <div key={item.productId} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem' 
            }}>
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.total}</span>
            </div>
          ))}
          <hr style={{ margin: '1rem 0' }} />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            <span>Total:</span>
            <span>₹{cart.total}</span>
          </div>
        </div>

        <button
          type="submit"
          className="payment-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;