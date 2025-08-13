# Low-Level Design (LLD) - Blinkit Clone

## 1. Introduction

This document provides detailed implementation specifications for the Blinkit Clone system, including class diagrams, method signatures, data structures, and algorithm implementations.

## 2. System Components Breakdown

### 2.1 Frontend Component Hierarchy

```
App (Root Component)
├── Header
│   ├── Logo
│   ├── Navigation Links
│   └── Cart Icon (with count)
├── Router
│   ├── Home Page
│   │   ├── Product Grid
│   │   │   └── Product Card (multiple)
│   │   └── Search & Filter Bar
│   ├── Cart Page
│   │   ├── Cart Items List
│   │   │   └── Cart Item (multiple)
│   │   └── Cart Summary
│   ├── Checkout Page
│   │   ├── Delivery Address Form
│   │   ├── Payment Method Selection
│   │   └── Order Summary
│   ├── Order Confirmation Page
│   │   ├── Success Message
│   │   ├── Timer Component
│   │   ├── Order Details
│   │   └── Delivery Partner Info
│   └── Order Tracking Page
│       ├── Order Status
│       ├── Tracking Steps
│       └── Order Items
└── Context Providers
    ├── CartContext
    └── OrderContext
```

### 2.2 Backend Service Architecture

```
server.js (Entry Point)
├── Routes
│   ├── Products Router (/api/products)
│   ├── Cart Router (/api/cart)
│   ├── Orders Router (/api/orders)
│   └── Payment Router (/api/payment)
├── Models
│   ├── Product Model
│   ├── Cart Model
│   └── Order Model
├── Socket.io Server
└── Middleware
    ├── CORS
    ├── Body Parser
    └── Error Handler
```

## 3. Data Structures and Models

### 3.1 Product Model

```javascript
class Product {
  constructor(name, price, category, image, description, inStock = true) {
    this.id = uuidv4();
    this.name = name;
    this.price = price;
    this.category = category;
    this.image = image;
    this.description = description;
    this.inStock = inStock;
    this.createdAt = new Date();
  }
}

// Sample Data Structure
const products = [
  {
    id: "uuid-string",
    name: "Milk - Amul Full Cream",
    price: 65,
    category: "Dairy",
    image: "/images/milk.jpg",
    description: "Fresh full cream milk 1L",
    inStock: true,
    createdAt: "2024-01-01T00:00:00.000Z"
  }
];
```

### 3.2 Cart Model

```javascript
class CartItem {
  constructor(productId, product, quantity = 1) {
    this.id = uuidv4();
    this.productId = productId;
    this.product = product;
    this.quantity = quantity;
    this.totalPrice = product.price * quantity;
  }

  updateQuantity(newQuantity) {
    this.quantity = newQuantity;
    this.totalPrice = this.product.price * newQuantity;
  }
}

class Cart {
  constructor(userId) {
    this.id = uuidv4();
    this.userId = userId;
    this.items = [];
    this.totalAmount = 0;
    this.totalItems = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.updateQuantity(existingItem.quantity + quantity);
    } else {
      const newItem = new CartItem(product.id, product, quantity);
      this.items.push(newItem);
    }
    
    this.calculateTotals();
    this.updatedAt = new Date();
  }

  calculateTotals() {
    this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0);
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getCartSummary() {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      totalAmount: this.totalAmount,
      totalItems: this.totalItems,
      deliveryFee: this.totalAmount > 199 ? 0 : 29,
      finalAmount: this.totalAmount > 199 ? this.totalAmount : this.totalAmount + 29
    };
  }
}
```

### 3.3 Order Model

```javascript
class Order {
  constructor(userId, cartData, paymentData, deliveryAddress) {
    this.id = uuidv4();
    this.userId = userId;
    this.orderNumber = this.generateOrderNumber();
    this.items = cartData.items;
    this.totalAmount = cartData.totalAmount;
    this.deliveryFee = cartData.deliveryFee;
    this.finalAmount = cartData.finalAmount;
    this.paymentId = paymentData.paymentId;
    this.paymentMethod = paymentData.method;
    this.deliveryAddress = deliveryAddress;
    this.status = 'placed';
    this.deliveryPartner = null;
    this.estimatedDeliveryTime = 30; // 30 minutes
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `BLK${timestamp.slice(-6)}${random}`;
  }

  assignDeliveryPartner(partnerName) {
    this.deliveryPartner = partnerName;
    this.status = 'assigned';
    this.updatedAt = new Date();
  }
}
```

## 4. API Endpoint Specifications

### 4.1 Products API

```javascript
// GET /api/products
// Query Parameters: category, search
// Response: { success: boolean, products: Product[], total: number }

router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let filteredProducts = products;
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      products: filteredProducts,
      total: filteredProducts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});
```

### 4.2 Cart API

```javascript
// POST /api/cart/:userId/add
// Body: { productId: string, quantity: number }
// Response: { success: boolean, message: string, cart: CartSummary }

router.post('/:userId/add', (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;
    
    // Validation
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
    
    // Get or create cart
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
```

### 4.3 Orders API

```javascript
// POST /api/orders/create
// Body: { userId: string, paymentData: object, deliveryAddress: object }
// Response: { success: boolean, order: OrderSummary }

router.post('/create', (req, res) => {
  try {
    const { userId, paymentData, deliveryAddress } = req.body;
    
    // Validation
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
```

## 5. Frontend Context Implementation

### 5.1 Cart Context

```javascript
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = 'user_123'; // Mock user ID

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/cart/${userId}/add`, {
        productId: product.id,
        quantity
      });
      
      if (response.data.success) {
        setCart(response.data.cart);
        toast.success(`${product.name} added to cart!`);
        return true;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    loading,
    userId,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItemCount: () => cart?.totalItems || 0,
    isInCart: (productId) => cart?.items?.some(item => item.productId === productId) || false
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
```

### 5.2 Order Context

```javascript
const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  const completeCheckout = async (cartData, deliveryAddress, paymentMethod) => {
    try {
      // Step 1: Create payment order
      const paymentOrder = await createPaymentOrder(cartData.finalAmount, cartData.userId);
      
      // Step 2: Process payment (dummy)
      const paymentResult = await processPayment(paymentOrder.id, cartData.finalAmount);
      
      // Step 3: Create order
      const order = await createOrder(cartData.userId, paymentResult, deliveryAddress);
      
      return order;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{
      currentOrder,
      loading,
      completeCheckout,
      trackOrder,
      getPaymentMethods
    }}>
      {children}
    </OrderContext.Provider>
  );
};
```

## 6. Component Implementation Details

### 6.1 ProductCard Component

```javascript
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
      updateQuantity(product.id, 0);
    }
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
            <button className="qty-btn" onClick={handleDecrement}>
              <Minus size={16} />
            </button>
            <span className="quantity">{quantityInCart}</span>
            <button className="qty-btn" onClick={handleIncrement}>
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

### 6.2 Timer Component Implementation

```javascript
const Timer = ({ initialTime = 30 }) => {
  const [timer, setTimer] = useState(initialTime);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      <Clock size={24} style={{ marginRight: '0.5rem' }} />
      {timer > 0 
        ? `Your order will be delivered in approximately ${formatTime(timer)} minutes`
        : 'Your order is being prepared for delivery!'
      }
    </div>
  );
};
```

## 7. Socket.io Implementation

### 7.1 Server-side Socket Implementation

```javascript
// server.js
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
        estimatedTime: 30
      });
    }, 2000);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
```

### 7.2 Client-side Socket Implementation

```javascript
// OrderContext.js
const initializeSocket = () => {
  const newSocket = io('http://localhost:5000');
  setSocket(newSocket);
  
  // Listen for delivery partner assignment
  newSocket.on('deliveryPartnerAssigned', (data) => {
    if (data.orderId === currentOrder?.id) {
      setCurrentOrder(prev => ({
        ...prev,
        deliveryPartner: data.partnerName,
        status: 'assigned'
      }));
      toast.success(`Delivery partner assigned: ${data.partnerName}`);
    }
  });
  
  return newSocket;
};
```

## 8. Validation and Error Handling

### 8.1 Form Validation

```javascript
const validateForm = () => {
  const required = ['fullName', 'phone', 'address', 'pincode', 'city', 'state'];
  
  for (let field of required) {
    if (!deliveryAddress[field].trim()) {
      toast.error(`Please enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      return false;
    }
  }
  
  // Validate phone number
  if (!/^\d{10}$/.test(deliveryAddress.phone)) {
    toast.error('Please enter a valid 10-digit phone number');
    return false;
  }
  
  // Validate pincode
  if (!/^\d{6}$/.test(deliveryAddress.pincode)) {
    toast.error('Please enter a valid 6-digit pincode');
    return false;
  }
  
  return true;
};
```

### 8.2 API Error Handling

```javascript
const handleApiError = (error, defaultMessage) => {
  const message = error.response?.data?.message || error.message || defaultMessage;
  toast.error(message);
  console.error('API Error:', error);
  return message;
};

// Usage in async functions
try {
  const response = await axios.post('/api/endpoint', data);
  return response.data;
} catch (error) {
  handleApiError(error, 'Operation failed');
  throw error;
}
```

## 9. State Management Patterns

### 9.1 Cart State Updates

```javascript
// Optimistic updates with rollback on error
const updateQuantity = async (productId, quantity) => {
  const previousCart = { ...cart };
  
  // Optimistically update UI
  const updatedCart = updateCartQuantityLocally(cart, productId, quantity);
  setCart(updatedCart);
  
  try {
    const response = await axios.put(`/api/cart/${userId}/update`, {
      productId,
      quantity
    });
    
    if (response.data.success) {
      setCart(response.data.cart);
    }
  } catch (error) {
    // Rollback on error
    setCart(previousCart);
    handleApiError(error, 'Failed to update quantity');
  }
};
```

### 9.2 Loading States

```javascript
const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (asyncFunction) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, execute };
};
```

## 10. Performance Optimizations

### 10.1 React Optimizations

```javascript
// Memoized product card to prevent unnecessary re-renders
const ProductCard = React.memo(({ product }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.product.id === nextProps.product.id &&
         prevProps.product.inStock === nextProps.product.inStock;
});

// Debounced search to reduce API calls
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

### 10.2 Backend Optimizations

```javascript
// Response caching for product categories
const categoryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

router.get('/categories/list', (req, res) => {
  const cacheKey = 'categories';
  const cached = categoryCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return res.json(cached.data);
  }
  
  const categories = [...new Set(products.map(product => product.category))];
  const response = { success: true, categories };
  
  categoryCache.set(cacheKey, {
    data: response,
    timestamp: Date.now()
  });
  
  res.json(response);
});
```

This Low-Level Design provides comprehensive implementation details for building a robust, scalable, and maintainable Blinkit clone application.