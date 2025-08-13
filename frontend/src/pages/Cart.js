import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <ShoppingBag size={80} />
          </div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <Link to="/" className="checkout-btn" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityUpdate = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const getProductIcon = (category) => {
    const icons = {
      'Dairy': '🥛',
      'Bakery': '🍞',
      'Fruits': '🍌',
      'Vegetables': '🥕',
      'Grains': '🌾',
      'Cooking': '🫒',
      'Groceries': '🍚',
      'Beverages': '☕',
      'Instant Food': '🍜',
      'Snacks': '🍪'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="container">
      <div className="cart-page">
        <h1>Your Cart ({cart.totalItems} items)</h1>
        
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {getProductIcon(item.product.category)}
              </div>
              
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.product.name}</h3>
                <p className="cart-item-price">₹{item.product.price} each</p>
                <p className="text-muted">{item.product.description}</p>
                
                <div className="quantity-controls">
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityUpdate(item.productId, item.quantity - 1)}
                    disabled={loading}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => handleQuantityUpdate(item.productId, item.quantity + 1)}
                    disabled={loading}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="cart-item-actions">
                <div className="cart-item-total">
                  ₹{item.totalPrice}
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.productId)}
                  disabled={loading}
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal ({cart.totalItems} items)</span>
            <span>₹{cart.totalAmount}</span>
          </div>
          
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>
              {cart.deliveryFee === 0 ? (
                <span className="text-green">FREE</span>
              ) : (
                `₹${cart.deliveryFee}`
              )}
            </span>
          </div>
          
          {cart.totalAmount < 199 && (
            <div className="summary-row text-muted" style={{ fontSize: '0.9rem' }}>
              <span>Add ₹{199 - cart.totalAmount} more for free delivery</span>
            </div>
          )}
          
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{cart.finalAmount}</span>
          </div>
          
          <Link 
            to="/checkout" 
            className="checkout-btn"
            style={{ textDecoration: 'none' }}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;