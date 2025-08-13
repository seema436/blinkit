const express = require('express');
const router = express.Router();
const { Cart, userCarts } = require('../models/Cart');
const { products } = require('../models/Product');

// GET /api/cart/:userId - Get user's cart
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userCarts.has(userId)) {
      userCarts.set(userId, new Cart(userId));
    }
    
    const cart = userCarts.get(userId);
    
    res.json({
      success: true,
      cart: cart.getCartSummary()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
});

// POST /api/cart/:userId/add - Add item to cart
router.post('/:userId/add', (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (!product.inStock) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }
    
    if (!userCarts.has(userId)) {
      userCarts.set(userId, new Cart(userId));
    }
    
    const cart = userCarts.get(userId);
    cart.addItem(product, quantity);
    
    res.json({
      success: true,
      message: 'Item added to cart successfully',
      cart: cart.getCartSummary()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
});

// PUT /api/cart/:userId/update - Update item quantity in cart
router.put('/:userId/update', (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }
    
    if (!userCarts.has(userId)) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const cart = userCarts.get(userId);
    cart.updateItemQuantity(productId, quantity);
    
    res.json({
      success: true,
      message: 'Cart updated successfully',
      cart: cart.getCartSummary()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
});

// DELETE /api/cart/:userId/remove/:productId - Remove item from cart
router.delete('/:userId/remove/:productId', (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    if (!userCarts.has(userId)) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const cart = userCarts.get(userId);
    cart.removeItem(productId);
    
    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: cart.getCartSummary()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// DELETE /api/cart/:userId/clear - Clear entire cart
router.delete('/:userId/clear', (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userCarts.has(userId)) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const cart = userCarts.get(userId);
    cart.clearCart();
    
    res.json({
      success: true,
      message: 'Cart cleared successfully',
      cart: cart.getCartSummary()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

module.exports = router;