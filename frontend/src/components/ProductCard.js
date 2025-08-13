import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, getItemQuantity, loading } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantityInCart + 1);
  };

  const handleDecrement = () => {
    if (quantityInCart > 1) {
      updateQuantity(product.id, quantityInCart - 1);
    } else {
      updateQuantity(product.id, 0); // This will remove the item
    }
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
    <div className="product-card">
      <div className="product-image">
        {getProductIcon(product.category)}
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">₹{product.price}</div>
      </div>
      
      <div className="product-actions">
        {quantityInCart === 0 ? (
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={loading || !product.inStock}
          >
            {!product.inStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
        ) : (
          <div className="quantity-controls">
            <button
              className="qty-btn"
              onClick={handleDecrement}
              disabled={loading}
            >
              <Minus size={16} />
            </button>
            <span className="quantity">{quantityInCart}</span>
            <button
              className="qty-btn"
              onClick={handleIncrement}
              disabled={loading}
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;