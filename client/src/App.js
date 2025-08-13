import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderSummary from './components/OrderSummary';
import DeliveryTracking from './components/DeliveryTracking';
import './App.css';

function App() {
  return (
    <Router>
      <CartProvider>
        <OrderProvider>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-summary/:orderId" element={<OrderSummary />} />
                <Route path="/delivery-tracking/:orderId" element={<DeliveryTracking />} />
              </Routes>
            </main>
          </div>
        </OrderProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
