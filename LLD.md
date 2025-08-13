# Low-Level Design (LLD) - Blinkit Clone

## 1. Database Schema Design

### 1.1 Product Schema
```javascript
Product {
  id: Number (Primary Key)
  name: String (Required)
  price: Number (Required)
  category: String (Required)
  image: String (URL)
  stock: Number (Required)
  createdAt: Date
  updatedAt: Date
}
```

### 1.2 Cart Schema
```javascript
Cart {
  userId: String (Primary Key)
  items: Array<CartItem>
  total: Number
  updatedAt: Date
}

CartItem {
  productId: Number
  name: String
  price: Number
  quantity: Number
  total: Number
  image: String
}
```

### 1.3 Order Schema
```javascript
Order {
  id: String (UUID, Primary Key)
  userId: String (Required)
  items: Array<OrderItem>
  total: Number (Required)
  paymentId: String
  deliveryAddress: Address
  deliveryPartner: String
  status: String (confirmed, prepared, out_for_delivery, delivered)
  orderDate: Date
  estimatedDelivery: Date
  actualDelivery: Date
}

OrderItem {
  productId: Number
  name: String
  price: Number
  quantity: Number
  total: Number
}

Address {
  fullName: String
  phone: String
  address: String
  city: String
  pincode: String
}
```

## 2. API Endpoint Specifications

### 2.1 Product Endpoints

#### GET /api/products
**Purpose**: Retrieve all available products
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Fresh Tomatoes",
      "price": 40,
      "category": "Vegetables",
      "image": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Tomatoes",
      "stock": 50
    }
  ]
}
```

### 2.2 Cart Endpoints

#### GET /api/cart/:userId
**Purpose**: Get user's cart
**Parameters**: userId (String)
**Response**:
```json
{
  "items": [
    {
      "productId": 1,
      "name": "Fresh Tomatoes",
      "price": 40,
      "quantity": 2,
      "total": 80,
      "image": "https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Tomatoes"
    }
  ],
  "total": 80
}
```

#### POST /api/cart/add
**Purpose**: Add item to cart
**Request Body**:
```json
{
  "userId": "user123",
  "productId": 1,
  "quantity": 1
}
```

#### PUT /api/cart/update
**Purpose**: Update cart item quantity
**Request Body**:
```json
{
  "userId": "user123",
  "productId": 1,
  "quantity": 3
}
```

#### DELETE /api/cart/remove/:userId/:productId
**Purpose**: Remove item from cart
**Parameters**: userId (String), productId (Number)

### 2.3 Order Endpoints

#### POST /api/payment/create-order
**Purpose**: Create payment order with Razorpay
**Request Body**:
```json
{
  "amount": 200,
  "currency": "INR"
}
```
**Response**:
```json
{
  "id": "order_123456789",
  "amount": 20000,
  "currency": "INR",
  "receipt": "order_receipt_123"
}
```

#### POST /api/orders/place
**Purpose**: Place order after payment
**Request Body**:
```json
{
  "userId": "user123",
  "paymentId": "pay_123456789",
  "deliveryAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "address": "123 Main St",
    "city": "Mumbai",
    "pincode": "400001"
  }
}
```

#### GET /api/orders/:orderId
**Purpose**: Get order details
**Response**:
```json
{
  "id": "order_uuid_123",
  "userId": "user123",
  "items": [...],
  "total": 200,
  "deliveryPartner": "Rahul Kumar",
  "status": "confirmed",
  "orderDate": "2024-01-15T10:30:00Z",
  "estimatedDelivery": "2024-01-15T11:00:00Z"
}
```

## 3. Component Architecture

### 3.1 Frontend Component Hierarchy
```
App
├── CartProvider
├── OrderProvider
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   └── Cart Icon (with badge)
├── Routes
│   ├── ProductList
│   │   └── ProductCard[]
│   ├── Cart
│   │   ├── CartItem[]
│   │   ├── Quantity Controls
│   │   └── Checkout Button
│   ├── Checkout
│   │   ├── Address Form
│   │   ├── Order Summary
│   │   └── Payment Button
│   ├── OrderSummary
│   │   ├── Order Details
│   │   ├── Delivery Info
│   │   └── Track Order Button
│   └── DeliveryTracking
│       ├── Timer Display
│       ├── Progress Steps
│       └── Delivery Partner Info
```

### 3.2 Context Providers

#### CartContext
```javascript
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return action.payload;
    case 'ADD_ITEM':
      return action.payload;
    case 'UPDATE_ITEM':
      return action.payload;
    case 'REMOVE_ITEM':
      return action.payload;
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};
```

#### OrderContext
```javascript
const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(30 * 60);
  const [socket, setSocket] = useState(null);
  
  // Timer management
  useEffect(() => {
    let timer;
    if (currentOrder && deliveryTime > 0) {
      timer = setInterval(() => {
        setDeliveryTime(prev => prev > 1 ? prev - 1 : 0);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentOrder, deliveryTime]);
};
```

## 4. State Management

### 4.1 Frontend State Structure
```javascript
// Cart State
{
  items: [
    {
      productId: 1,
      name: "Fresh Tomatoes",
      price: 40,
      quantity: 2,
      total: 80,
      image: "url"
    }
  ],
  total: 80
}

// Order State
{
  currentOrder: {
    id: "uuid",
    items: [...],
    total: 200,
    deliveryPartner: "Rahul Kumar",
    status: "confirmed"
  },
  deliveryTime: 1800, // seconds
  socket: SocketIO instance
}
```

### 4.2 Backend State Management
```javascript
// In-memory storage (for demo)
let products = [...];
let carts = {};
let orders = {};
let deliveryPartners = ["Rahul Kumar", "Priya Singh", ...];
```

## 5. Real-time Communication

### 5.1 Socket.IO Events

#### Server-side Event Handlers
```javascript
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Emit events
io.emit('orderConfirmed', { orderId, deliveryPartner });
io.emit('orderStatusUpdate', { orderId, status });
```

#### Client-side Event Listeners
```javascript
useEffect(() => {
  const newSocket = io('http://localhost:5000');
  
  newSocket.on('orderConfirmed', (data) => {
    console.log('Order confirmed:', data);
  });
  
  newSocket.on('orderStatusUpdate', (data) => {
    console.log('Order status update:', data);
  });
  
  return () => newSocket.close();
}, []);
```

## 6. Payment Integration

### 6.1 Razorpay Integration
```javascript
// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
const createPaymentOrder = async (amount) => {
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `order_${uuidv4()}`,
    payment_capture: 1
  };
  
  return await razorpay.orders.create(options);
};
```

### 6.2 Payment Flow
```javascript
// 1. Create payment order
const paymentOrder = await createPaymentOrder(orderTotal);

// 2. Simulate payment success (demo)
const paymentId = `pay_${Date.now()}`;

// 3. Place order
const order = await placeOrder(userId, paymentId, deliveryAddress);

// 4. Emit confirmation
io.emit('orderConfirmed', { orderId: order.id, deliveryPartner: order.deliveryPartner });
```

## 7. Delivery System

### 7.1 Timer Implementation
```javascript
const DeliveryTimer = () => {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return <div className="timer">{formatTime(timeLeft)}</div>;
};
```

### 7.2 Delivery Progress Tracking
```javascript
const deliverySteps = [
  { title: 'Order Confirmed', description: 'Order confirmed and being prepared' },
  { title: 'Order Prepared', description: 'Items packed and ready for delivery' },
  { title: 'Out for Delivery', description: 'Delivery partner on the way' },
  { title: 'Delivered', description: 'Order successfully delivered' }
];

const getCurrentStep = (deliveryTime) => {
  const progress = Math.floor(((30 * 60 - deliveryTime) / (30 * 60)) * 4);
  return Math.min(progress, 3);
};
```

## 8. Error Handling

### 8.1 Frontend Error Handling
```javascript
// API Error Interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 404) {
      // Handle not found
    } else if (error.response?.status === 500) {
      // Handle server error
    }
    return Promise.reject(error);
  }
);

// Component Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

### 8.2 Backend Error Handling
```javascript
// Global error handler
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// API error responses
const handleApiError = (res, error, status = 500) => {
  console.error('API Error:', error);
  res.status(status).json({
    error: error.message || 'An error occurred',
    success: false
  });
};
```

## 9. Validation

### 9.1 Frontend Validation
```javascript
// Form validation
const validateAddress = (address) => {
  const errors = {};
  
  if (!address.fullName) errors.fullName = 'Full name is required';
  if (!address.phone) errors.phone = 'Phone number is required';
  if (!address.address) errors.address = 'Address is required';
  if (!address.city) errors.city = 'City is required';
  if (!address.pincode) errors.pincode = 'Pincode is required';
  
  return errors;
};

// Cart validation
const validateCart = (cart) => {
  if (!cart.items || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }
  
  if (cart.total <= 0) {
    throw new Error('Invalid cart total');
  }
};
```

### 9.2 Backend Validation
```javascript
// Input validation middleware
const validateCartItem = (req, res, next) => {
  const { userId, productId, quantity } = req.body;
  
  if (!userId || !productId || !quantity) {
    return res.status(400).json({
      error: 'Missing required fields',
      success: false
    });
  }
  
  if (quantity <= 0) {
    return res.status(400).json({
      error: 'Quantity must be greater than 0',
      success: false
    });
  }
  
  next();
};
```

## 10. Performance Optimizations

### 10.1 Frontend Optimizations
```javascript
// React.memo for component optimization
const ProductCard = React.memo(({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      {/* Product content */}
    </div>
  );
});

// useCallback for function optimization
const handleAddToCart = useCallback((productId) => {
  addToCart(productId, 1);
}, [addToCart]);

// useMemo for expensive calculations
const cartTotal = useMemo(() => {
  return cart.items.reduce((sum, item) => sum + item.total, 0);
}, [cart.items]);
```

### 10.2 Backend Optimizations
```javascript
// Caching frequently accessed data
const productCache = new Map();

const getProducts = async (req, res) => {
  if (productCache.has('all')) {
    return res.json(productCache.get('all'));
  }
  
  const products = await fetchProductsFromDB();
  productCache.set('all', products);
  res.json(products);
};

// Efficient cart total calculation
const calculateCartTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};
```

## 11. Security Implementation

### 11.1 Input Sanitization
```javascript
// Sanitize user inputs
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, '').trim();
};

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};
```

### 11.2 CORS Configuration
```javascript
// CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 12. Testing Specifications

### 12.1 Unit Tests
```javascript
// Cart reducer tests
describe('Cart Reducer', () => {
  test('should add item to cart', () => {
    const initialState = { items: [], total: 0 };
    const action = { type: 'ADD_ITEM', payload: { items: [...], total: 40 } };
    const newState = cartReducer(initialState, action);
    expect(newState.total).toBe(40);
  });
});

// API endpoint tests
describe('Cart API', () => {
  test('should add item to cart', async () => {
    const response = await request(app)
      .post('/api/cart/add')
      .send({ userId: 'user123', productId: 1, quantity: 1 });
    
    expect(response.status).toBe(200);
    expect(response.body.total).toBeGreaterThan(0);
  });
});
```

### 12.2 Integration Tests
```javascript
// End-to-end order flow test
describe('Order Flow', () => {
  test('should complete order from cart to delivery', async () => {
    // 1. Add item to cart
    // 2. Proceed to checkout
    // 3. Complete payment
    // 4. Verify order confirmation
    // 5. Check delivery tracking
  });
});
```

## 13. Deployment Configuration

### 13.1 Environment Configuration
```javascript
// Environment variables
const config = {
  port: process.env.PORT || 5000,
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
  },
  delivery: {
    defaultTime: 30 * 60, // 30 minutes in seconds
    partners: ['Rahul Kumar', 'Priya Singh', ...]
  }
};
```

### 13.2 Production Build
```javascript
// Frontend build script
"scripts": {
  "build": "react-scripts build",
  "start": "node server.js",
  "dev": "nodemon server.js"
}

// Backend production setup
const path = require('path');
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
```

## 14. Monitoring & Logging

### 14.1 Application Logging
```javascript
// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error logging
const logError = (error, context) => {
  console.error({
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    context
  });
};
```

### 14.2 Performance Monitoring
```javascript
// Response time monitoring
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

This LLD provides detailed technical specifications for implementing the Blinkit Clone application, covering all aspects from database design to deployment configuration.