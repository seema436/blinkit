import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            🛒 Blinkit
          </Link>
          
          <nav className="nav-links">
            <Link to="/" className="nav-link">
              <Home size={20} />
              Home
            </Link>
            
            <Link to="/cart" className="cart-icon">
              <ShoppingCart size={20} />
              Cart
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;