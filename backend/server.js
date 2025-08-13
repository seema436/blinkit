const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payment');

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
app.use(express.static('public'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('orderPlaced', (orderData) => {
    // Simulate delivery partner assignment after 2 seconds
    setTimeout(() => {
      const deliveryPartners = [
        'Rajesh Kumar', 'Amit Singh', 'Priya Sharma', 'Vikash Yadav', 
        'Rohit Gupta', 'Sneha Patel', 'Arjun Mehta', 'Kavya Reddy'
      ];
      const randomPartner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];
      
      socket.emit('deliveryPartnerAssigned', {
        orderId: orderData.orderId,
        partnerName: randomPartner,
        estimatedTime: 30 // 30 minutes
      });
    }, 2000);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});