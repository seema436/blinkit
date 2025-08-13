import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItem(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart.items.length > 0) {
      navigate('/checkout');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Your cart is empty</h2>
          <p style={{ color: '#636e72', marginBottom: '2rem' }}>
            Add some products to get started!
          </p>
          <button
            className="add-to-cart-btn"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="cart-title">Shopping Cart</h2>
        <span>{cart.items.length} items</span>
      </div>

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.productId} className="cart-item">
            <img
              src={item.image}
              alt={item.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3 className="cart-item-name">{item.name}</h3>
              <p className="cart-item-price">₹{item.price}</p>
            </div>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
              >
                <FaMinus />
              </button>
              <span className="quantity-display">{item.quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
              >
                <FaPlus />
              </button>
            </div>
            <div className="cart-item-details">
              <p className="cart-item-price">₹{item.total}</p>
            </div>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.productId)}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <span>Total:</span>
        <span>₹{cart.total}</span>
      </div>

      <button
        className="checkout-btn"
        onClick={handleCheckout}
        disabled={cart.items.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;