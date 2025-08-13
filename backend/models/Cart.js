const { v4: uuidv4 } = require('uuid');

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

  removeItem(productId) {
    this.items = this.items.filter(item => item.productId !== productId);
    this.calculateTotals();
    this.updatedAt = new Date();
  }

  updateItemQuantity(productId, quantity) {
    const item = this.items.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.updateQuantity(quantity);
        this.calculateTotals();
        this.updatedAt = new Date();
      }
    }
  }

  calculateTotals() {
    this.totalAmount = this.items.reduce((total, item) => total + item.totalPrice, 0);
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart() {
    this.items = [];
    this.totalAmount = 0;
    this.totalItems = 0;
    this.updatedAt = new Date();
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

// In-memory cart storage (replace with database in production)
const userCarts = new Map();

module.exports = { Cart, CartItem, userCarts };