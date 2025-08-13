import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          Blinkit Clone
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Products
          </Link>
          <Link to="/cart" className="nav-link">
            <div className="cart-icon">
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;