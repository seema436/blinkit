const express = require('express');
const router = express.Router();
const { Order, orders } = require('../models/Order');
const { userCarts } = require('../models/Cart');

// POST /api/orders/create - Create new order
router.post('/create', (req, res) => {
  try {
    const { userId, paymentData, deliveryAddress } = req.body;
    
    if (!userId || !paymentData || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'User ID, payment data, and delivery address are required'
      });
    }
    
    // Get user's cart
    const cart = userCarts.get(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Create order
    const order = new Order(userId, cart.getCartSummary(), paymentData, deliveryAddress);
    orders.set(order.id, order);
    
    // Clear cart after successful order
    cart.clearCart();
    
    res.json({
      success: true,
      message: 'Order created successfully',
      order: order.getOrderSummary()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// GET /api/orders/:orderId - Get order by ID
router.get('/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order: order.getOrderSummary()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// GET /api/orders/user/:userId - Get user's orders
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const userOrders = Array.from(orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      orders: userOrders.map(order => order.getOrderSummary()),
      total: userOrders.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user orders',
      error: error.message
    });
  }
});

// PUT /api/orders/:orderId/status - Update order status
router.put('/:orderId/status', (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.updateStatus(status);
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: order.getOrderSummary()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// PUT /api/orders/:orderId/assign-partner - Assign delivery partner
router.put('/:orderId/assign-partner', (req, res) => {
  try {
    const { orderId } = req.params;
    const { partnerName } = req.body;
    
    if (!partnerName) {
      return res.status(400).json({
        success: false,
        message: 'Partner name is required'
      });
    }
    
    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.assignDeliveryPartner(partnerName);
    
    res.json({
      success: true,
      message: 'Delivery partner assigned successfully',
      order: order.getOrderSummary()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning delivery partner',
      error: error.message
    });
  }
});

// GET /api/orders/:orderId/track - Track order
router.get('/:orderId/track', (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = orders.get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Simulate tracking steps
    const trackingSteps = [
      {
        status: 'placed',
        message: 'Order placed successfully',
        timestamp: order.createdAt,
        completed: true
      },
      {
        status: 'confirmed',
        message: 'Order confirmed by store',
        timestamp: new Date(order.createdAt.getTime() + 2 * 60000), // +2 minutes
        completed: order.status !== 'placed'
      },
      {
        status: 'assigned',
        message: `Assigned to delivery partner: ${order.deliveryPartner || 'Pending'}`,
        timestamp: new Date(order.createdAt.getTime() + 5 * 60000), // +5 minutes
        completed: order.deliveryPartner !== null
      },
      {
        status: 'picked',
        message: 'Order picked up by delivery partner',
        timestamp: new Date(order.createdAt.getTime() + 10 * 60000), // +10 minutes
        completed: ['picked', 'delivered'].includes(order.status)
      },
      {
        status: 'delivered',
        message: 'Order delivered successfully',
        timestamp: new Date(order.createdAt.getTime() + 30 * 60000), // +30 minutes
        completed: order.status === 'delivered'
      }
    ];
    
    res.json({
      success: true,
      order: order.getOrderSummary(),
      tracking: trackingSteps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking order',
      error: error.message
    });
  }
});

module.exports = router;