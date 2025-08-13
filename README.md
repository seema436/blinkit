# Blinkit Clone - E-commerce Application

A complete Blinkit-like e-commerce application with cart management, payment integration, and real-time delivery tracking.

## Features

- 🛒 **Shopping Cart Management**: Add, remove, and update items with real-time total calculation
- 💳 **Payment Integration**: Dummy Razorpay payment gateway integration
- 📦 **Order Management**: Complete order lifecycle from placement to delivery
- 🚚 **Real-time Delivery Tracking**: Live timer and delivery status updates
- 👤 **Delivery Partner Assignment**: Random delivery partner assignment for each order
- ⏱️ **30-Minute Delivery Timer**: Countdown timer showing delivery progress
- 📱 **Responsive Design**: Mobile-friendly UI with modern design

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **Razorpay** - Payment gateway integration
- **UUID** - Unique identifier generation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **React Icons** - Icon library
- **CSS3** - Styling with modern design

## Project Structure

```
blinkit-clone/
├── server.js                 # Main Express server
├── package.json             # Backend dependencies
├── .env                     # Environment variables
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Navbar.js
│   │   │   ├── ProductList.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── OrderSummary.js
│   │   │   └── DeliveryTracking.js
│   │   ├── contexts/        # React contexts
│   │   │   ├── CartContext.js
│   │   │   └── OrderContext.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json         # Frontend dependencies
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update Razorpay credentials (optional for demo)

3. Start the backend server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

### Quick Start (All-in-one)
```bash
# Install all dependencies
npm run install-all

# Start backend (in one terminal)
npm start

# Start frontend (in another terminal)
npm run client
```

## API Endpoints

### Products
- `GET /api/products` - Get all products

### Cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:userId/:productId` - Remove item from cart

### Orders
- `POST /api/payment/create-order` - Create payment order
- `POST /api/orders/place` - Place order
- `GET /api/orders/:orderId` - Get order details
- `GET /api/orders/user/:userId` - Get user orders
- `PUT /api/orders/:orderId/status` - Update order status

## Workflow

### 1. User Journey
1. **Browse Products**: User views available products on homepage
2. **Add to Cart**: User adds items to cart with quantity
3. **Cart Management**: User can modify quantities or remove items
4. **Checkout**: User fills delivery address and proceeds to payment
5. **Payment**: Dummy payment processing with Razorpay
6. **Order Confirmation**: Order summary with delivery details
7. **Delivery Tracking**: Real-time tracking with 30-minute timer

### 2. Delivery Process
- **Order Confirmed**: Order is placed and confirmed
- **Order Prepared**: Items are being packed
- **Out for Delivery**: Delivery partner is en route
- **Delivered**: Order successfully delivered

### 3. Timer System
- 30-minute countdown timer starts after order placement
- Real-time updates every second
- Progress indicators update every 5 seconds
- Delivery partner assigned randomly for each order

## Key Features Implementation

### Cart Management
- Real-time cart updates using React Context
- Persistent cart state with backend synchronization
- Quantity controls with add/remove functionality
- Total calculation with automatic updates

### Payment Integration
- Razorpay payment gateway integration
- Dummy payment processing for demo
- Payment order creation and verification
- Secure payment flow

### Delivery Tracking
- Socket.IO for real-time updates
- Live countdown timer (30 minutes)
- Progress indicators with visual feedback
- Delivery partner information display
- Status updates throughout delivery process

### Responsive Design
- Mobile-first approach
- Modern UI with gradients and shadows
- Smooth animations and transitions
- Cross-browser compatibility

## Environment Variables

```env
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

## Running the Application

1. **Start Backend**:
   ```bash
   npm start
   ```
   Server runs on: http://localhost:5000

2. **Start Frontend**:
   ```bash
   cd client
   npm start
   ```
   App runs on: http://localhost:3000

3. **Access the Application**:
   - Open http://localhost:3000 in your browser
   - Browse products and add them to cart
   - Complete checkout process
   - Track delivery in real-time

## Demo Data

The application includes sample products:
- Fresh Tomatoes (₹40)
- Organic Milk (₹60)
- Whole Wheat Bread (₹35)
- Fresh Apples (₹120)
- Chicken Breast (₹200)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.