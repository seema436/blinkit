# Blinkit Clone - E-commerce Grocery Delivery Platform

A complete e-commerce platform built with React.js frontend and Node.js backend, simulating the Blinkit grocery delivery experience with real-time order tracking and payment integration.

## 🚀 Features

### Core Functionality
- **Product Catalog**: Browse groceries by categories with search functionality
- **Shopping Cart**: Add, update, remove items with real-time total calculation
- **Checkout Process**: Complete delivery address and payment workflow
- **Order Management**: Full order lifecycle from placement to delivery
- **Real-time Tracking**: Live order status updates with delivery partner assignment
- **Payment Integration**: Dummy Razorpay integration for payment processing

### Technical Features
- **Real-time Updates**: Socket.io for live delivery partner assignment
- **Responsive Design**: Mobile-first approach with modern UI
- **State Management**: React Context API for cart and order management
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: Comprehensive error handling and user feedback
- **Timer Integration**: 30-second countdown timer for delivery estimates

## 🛠 Tech Stack

### Frontend
- **React.js 18** - UI framework
- **React Router** - Client-side routing
- **React Context API** - State management
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
blinkit-clone/
├── backend/
│   ├── models/
│   │   ├── Product.js          # Product model and sample data
│   │   ├── Cart.js             # Cart model and operations
│   │   └── Order.js            # Order model and lifecycle
│   ├── routes/
│   │   ├── products.js         # Product API endpoints
│   │   ├── cart.js             # Cart API endpoints
│   │   ├── orders.js           # Order API endpoints
│   │   └── payment.js          # Payment API endpoints
│   └── server.js               # Main server file
├── frontend/
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js       # Navigation header
│   │   │   └── ProductCard.js  # Product display card
│   │   ├── context/
│   │   │   ├── CartContext.js  # Cart state management
│   │   │   └── OrderContext.js # Order state management
│   │   ├── pages/
│   │   │   ├── Home.js         # Product listing page
│   │   │   ├── Cart.js         # Shopping cart page
│   │   │   ├── Checkout.js     # Checkout form page
│   │   │   ├── OrderConfirmation.js # Order success page
│   │   │   └── OrderTracking.js     # Order tracking page
│   │   ├── styles/
│   │   │   └── global.css      # Global styles
│   │   ├── App.js              # Main app component
│   │   └── index.js            # React entry point
├── package.json                # Root dependencies
└── README.md                   # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd blinkit-clone
```

2. **Install dependencies for both frontend and backend**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. **Start the application**

**Option A: Start both servers simultaneously (Recommended)**
```bash
# From root directory
npm run dev
```

**Option B: Start servers separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📱 User Journey

### 1. Product Discovery
- Browse products on the home page
- Search for specific items
- Filter by categories (Dairy, Fruits, Vegetables, etc.)

### 2. Shopping Cart
- Add products to cart with quantity controls
- Update quantities or remove items
- View cart summary with delivery fee calculation
- Free delivery on orders above ₹199

### 3. Checkout Process
- Enter delivery address with validation
- Select payment method (Card, UPI, Net Banking, Wallet)
- Complete dummy payment processing

### 4. Order Confirmation
- View order confirmation with unique order number
- 30-second countdown timer for delivery estimate
- Real-time delivery partner assignment notification

### 5. Order Tracking
- Track order status with visual progress indicators
- View delivery partner information
- Real-time status updates
- Estimated delivery time

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products with optional filtering
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/categories/list` - Get all categories

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add item to cart
- `PUT /api/cart/:userId/update` - Update item quantity
- `DELETE /api/cart/:userId/remove/:productId` - Remove item
- `DELETE /api/cart/:userId/clear` - Clear cart

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/:orderId` - Get order by ID
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders/:orderId/track` - Track order status

### Payment
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `POST /api/payment/simulate-success` - Simulate payment success
- `GET /api/payment/methods` - Get payment methods

## 🎯 Key Features Explained

### Real-time Order Updates
- Socket.io connection established after order placement
- Automatic delivery partner assignment within 2 seconds
- Real-time notifications for order status changes

### Payment Integration
- Dummy Razorpay integration for demonstration
- Multiple payment methods (Card, UPI, Net Banking, Wallet)
- Payment order creation and verification workflow

### Delivery Partner Assignment
- Random selection from predefined delivery partners
- Different partner assigned for each order
- Real-time notification to user

### Order Tracking
- 5-stage order lifecycle (Placed → Confirmed → Assigned → Picked → Delivered)
- Visual progress indicators
- Estimated delivery time calculations

### Cart Management
- Persistent cart data (in-memory for demo)
- Real-time quantity updates
- Automatic total calculation with delivery fees

## 🎨 UI/UX Features

### Design System
- Modern, clean interface inspired by Blinkit
- Green color scheme (#0c7b00) for branding
- Responsive design for all screen sizes
- Smooth animations and transitions

### User Experience
- Loading states for all async operations
- Toast notifications for user feedback
- Form validation with helpful error messages
- Empty states for cart and order tracking

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance

## 🧪 Testing the Application

### Sample User Flow
1. Visit http://localhost:3000
2. Browse products and add items to cart
3. Go to cart and proceed to checkout
4. Fill delivery address form
5. Select payment method and place order
6. View order confirmation with timer
7. Click "Track Order" to see progress
8. Watch for delivery partner assignment notification

### Sample Products
The application includes 12 sample products across different categories:
- Dairy (Milk, Eggs)
- Bakery (Bread)
- Fruits (Banana)
- Vegetables (Onion, Tomato)
- Grains (Rice)
- Cooking (Oil)
- Groceries (Sugar)
- Beverages (Tea)
- Instant Food (Maggi)
- Snacks (Biscuits)

## 🔮 Future Enhancements

### Technical Improvements
- Database integration (MongoDB/PostgreSQL)
- User authentication and authorization
- Real payment gateway integration
- Push notifications
- Advanced caching strategies
- API rate limiting

### Feature Additions
- User profiles and order history
- Product reviews and ratings
- Wishlist functionality
- Coupon and discount system
- Real-time chat support
- Inventory management
- Analytics dashboard

### Business Features
- Multi-vendor support
- Subscription orders
- Loyalty program
- Referral system
- Advanced delivery tracking with GPS
- Multiple delivery slots

## 📝 Notes

- This is a demonstration project with dummy data
- Payment integration is simulated (no real transactions)
- Delivery partner assignment is randomized
- Cart data is stored in memory (resets on server restart)
- All times are in Indian Standard Time (IST)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Blinkit's user experience
- Icons provided by Lucide React
- UI patterns inspired by modern e-commerce platforms

---

**Made with ❤️ for learning and demonstration purposes**