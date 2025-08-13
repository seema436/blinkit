import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, userId } = useCart();
  const { completeCheckout, getPaymentMethods, loading } = useOrder();
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phone: '',
    address: '',
    landmark: '',
    pincode: '',
    city: '',
    state: ''
  });
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);

  // Load payment methods
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await getPaymentMethods();
        setPaymentMethods(methods.filter(method => method.enabled));
        if (methods.length > 0) {
          setSelectedPaymentMethod(methods.find(method => method.enabled)?.id || '');
        }
      } catch (error) {
        console.error('Error loading payment methods:', error);
      }
    };
    
    loadPaymentMethods();
  }, [getPaymentMethods]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Handle address input change
  const handleAddressChange = (field, value) => {
    setDeliveryAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const required = ['fullName', 'phone', 'address', 'pincode', 'city', 'state'];
    
    for (let field of required) {
      if (!deliveryAddress[field].trim()) {
        toast.error(`Please enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return false;
    }
    
    // Validate phone number
    if (!/^\d{10}$/.test(deliveryAddress.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    // Validate pincode
    if (!/^\d{6}$/.test(deliveryAddress.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    
    return true;
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    try {
      setProcessing(true);
      
      const order = await completeCheckout(
        cart,
        deliveryAddress,
        selectedPaymentMethod
      );
      
      // Navigate to order confirmation
      navigate(`/order-confirmation/${order.id}`);
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container">
      <div className="checkout-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>Checkout</h1>
        
        {/* Order Summary */}
        <div className="cart-summary mb-3">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Items ({cart.totalItems})</span>
            <span>₹{cart.totalAmount}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>{cart.deliveryFee === 0 ? 'FREE' : `₹${cart.deliveryFee}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{cart.finalAmount}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="checkout-section" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <MapPin size={20} />
            Delivery Address
          </h3>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={deliveryAddress.fullName}
                onChange={(e) => handleAddressChange('fullName', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                value={deliveryAddress.phone}
                onChange={(e) => handleAddressChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                maxLength="10"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Address *</label>
            <textarea
              className="form-textarea"
              value={deliveryAddress.address}
              onChange={(e) => handleAddressChange('address', e.target.value)}
              placeholder="Enter your complete address"
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label>Landmark (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={deliveryAddress.landmark}
              onChange={(e) => handleAddressChange('landmark', e.target.value)}
              placeholder="Nearby landmark"
            />
          </div>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                className="form-input"
                value={deliveryAddress.pincode}
                onChange={(e) => handleAddressChange('pincode', e.target.value)}
                placeholder="Pincode"
                maxLength="6"
              />
            </div>
            
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                className="form-input"
                value={deliveryAddress.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="City"
              />
            </div>
            
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                className="form-input"
                value={deliveryAddress.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                placeholder="State"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="checkout-section" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <CreditCard size={20} />
            Payment Method
          </h3>
          
          <div className="payment-methods">
            {paymentMethods.map(method => (
              <label
                key={method.id}
                className={`payment-method ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <div className="payment-method-info">
                  <span className="payment-method-icon">{method.icon}</span>
                  <span>{method.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Place Order Button */}
        <button
          className="checkout-btn"
          onClick={handlePlaceOrder}
          disabled={processing || loading}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem' 
          }}
        >
          {processing ? (
            <>
              <Loader size={20} className="spinner" />
              Processing...
            </>
          ) : (
            `Place Order - ₹${cart.finalAmount}`
          )}
        </button>
      </div>
    </div>
  );
};

export default Checkout;