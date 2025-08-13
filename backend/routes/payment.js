const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Dummy Razorpay configuration
const razorpayConfig = {
  key_id: 'rzp_test_dummy_key',
  key_secret: 'dummy_secret_key'
};

// POST /api/payment/create-order - Create payment order
router.post('/create-order', (req, res) => {
  try {
    const { amount, currency = 'INR', userId } = req.body;
    
    if (!amount || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and user ID are required'
      });
    }
    
    // Simulate Razorpay order creation
    const orderId = `order_${uuidv4().replace(/-/g, '').substring(0, 14)}`;
    
    const orderData = {
      id: orderId,
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
      status: 'created',
      created_at: Date.now()
    };
    
    res.json({
      success: true,
      order: orderData,
      key: razorpayConfig.key_id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
});

// POST /api/payment/verify - Verify payment
router.post('/verify', (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      amount 
    } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Payment details are required'
      });
    }
    
    // Simulate payment verification (in real app, verify signature with Razorpay)
    const isValidPayment = true; // Always true for dummy
    
    if (isValidPayment) {
      const paymentData = {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: amount,
        status: 'success',
        method: 'card', // or upi, netbanking, etc.
        verifiedAt: new Date()
      };
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment: paymentData
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
});

// POST /api/payment/simulate-success - Simulate successful payment (for demo)
router.post('/simulate-success', (req, res) => {
  try {
    const { orderId, amount } = req.body;
    
    const paymentData = {
      paymentId: `pay_${uuidv4().replace(/-/g, '').substring(0, 14)}`,
      orderId: orderId,
      amount: amount,
      status: 'success',
      method: 'dummy',
      verifiedAt: new Date()
    };
    
    res.json({
      success: true,
      message: 'Payment completed successfully',
      payment: paymentData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
});

// GET /api/payment/methods - Get available payment methods
router.get('/methods', (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: '💳',
        enabled: true
      },
      {
        id: 'upi',
        name: 'UPI',
        icon: '📱',
        enabled: true
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        icon: '🏦',
        enabled: true
      },
      {
        id: 'wallet',
        name: 'Wallet',
        icon: '👛',
        enabled: true
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        icon: '💵',
        enabled: false // Disabled for demo
      }
    ];
    
    res.json({
      success: true,
      methods: paymentMethods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment methods',
      error: error.message
    });
  }
});

module.exports = router;