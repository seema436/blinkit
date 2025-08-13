const { v4: uuidv4 } = require('uuid');

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

  updateStatus(newStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  assignDeliveryPartner(partnerName) {
    this.deliveryPartner = partnerName;
    this.status = 'assigned';
    this.updatedAt = new Date();
  }

  getOrderSummary() {
    return {
      id: this.id,
      orderNumber: this.orderNumber,
      userId: this.userId,
      items: this.items,
      totalAmount: this.totalAmount,
      deliveryFee: this.deliveryFee,
      finalAmount: this.finalAmount,
      paymentId: this.paymentId,
      paymentMethod: this.paymentMethod,
      deliveryAddress: this.deliveryAddress,
      status: this.status,
      deliveryPartner: this.deliveryPartner,
      estimatedDeliveryTime: this.estimatedDeliveryTime,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

// In-memory order storage (replace with database in production)
const orders = new Map();

module.exports = { Order, orders };