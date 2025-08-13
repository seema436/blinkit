const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const Razorpay = require('razorpay');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_key'
});

// In-memory data storage (in production, use database)
let products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: 40,
    category: "Vegetables",
    image: "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Tomatoes",
    stock: 50
  },
  {
    id: 2,
    name: "Organic Milk",
    price: 60,
    category: "Dairy",
    image: "https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Milk",
    stock: 30
  },
  {
    id: 3,
    name: "Whole Wheat Bread",
    price: 35,
    category: "Bakery",
    image: "https://via.placeholder.com/150/45B7D1/FFFFFF?text=Bread",
    stock: 25
  },
  {
    id: 4,
    name: "Fresh Apples",
    price: 120,
    category: "Fruits",
    image: "https://via.placeholder.com/150/96CEB4/FFFFFF?text=Apples",
    stock: 40
  },
  {
    id: 5,
    name: "Chicken Breast",
    price: 200,
    category: "Meat",
    image: "https://via.placeholder.com/150/FFEAA7/FFFFFF?text=Chicken",
    stock: 20
  }
];

let carts = {};
let orders = {};
let deliveryPartners = [
  "Rahul Kumar", "Priya Singh", "Amit Patel", "Sneha Sharma", 
  "Vikram Malhotra", "Anjali Gupta", "Rajesh Kumar", "Meera Iyer"
];

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get cart for user
app.get('/api/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const userCart = carts[userId] || { items: [], total: 0 };
  res.json(userCart);
});

// Add item to cart
app.post('/api/cart/add', (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  
  if (!carts[userId]) {
    carts[userId] = { items: [], total: 0 };
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existingItem = carts[userId].items.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.total = existingItem.quantity * existingItem.price;
  } else {
    carts[userId].items.push({
      productId,
      name: product.name,
      price: product.price,
      quantity,
      total: product.price * quantity,
      image: product.image
    });
  }

  // Recalculate total
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + item.total, 0);
  
  res.json(carts[userId]);
});

// Update cart item quantity
app.put('/api/cart/update', (req, res) => {
  const { userId, productId, quantity } = req.body;
  
  if (!carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const item = carts[userId].items.find(item => item.productId === productId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    carts[userId].items = carts[userId].items.filter(item => item.productId !== productId);
  } else {
    item.quantity = quantity;
    item.total = item.price * quantity;
  }

  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + item.total, 0);
  
  res.json(carts[userId]);
});

// Remove item from cart
app.delete('/api/cart/remove/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;
  
  if (!carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  carts[userId].items = carts[userId].items.filter(item => item.productId !== parseInt(productId));
  carts[userId].total = carts[userId].items.reduce((sum, item) => sum + item.total, 0);
  
  res.json(carts[userId]);
});

// Create payment order
app.post('/api/payment/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `order_${uuidv4()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Place order
app.post('/api/orders/place', (req, res) => {
  const { userId, paymentId, deliveryAddress } = req.body;
  
  if (!carts[userId] || carts[userId].items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const orderId = uuidv4();
  const deliveryPartner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];
  
  const order = {
    id: orderId,
    userId,
    items: [...carts[userId].items],
    total: carts[userId].total,
    paymentId,
    deliveryAddress,
    deliveryPartner,
    status: 'confirmed',
    orderDate: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
  };

  orders[orderId] = order;
  
  // Clear cart after order placement
  carts[userId] = { items: [], total: 0 };

  // Emit order confirmation to connected clients
  io.emit('orderConfirmed', { orderId, deliveryPartner });

  res.json(order);
});

// Get order details
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders[orderId];
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(order);
});

// Get user orders
app.get('/api/orders/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userOrders = Object.values(orders).filter(order => order.userId === userId);
  res.json(userOrders);
});

// Update order status (for delivery tracking)
app.put('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  
  if (!orders[orderId]) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  orders[orderId].status = status;
  
  // Emit status update to connected clients
  io.emit('orderStatusUpdate', { orderId, status });
  
  res.json(orders[orderId]);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});