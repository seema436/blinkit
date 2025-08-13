const { v4: uuidv4 } = require('uuid');

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

// Sample products data
const products = [
  new Product('Milk - Amul Full Cream', 65, 'Dairy', '/images/milk.jpg', 'Fresh full cream milk 1L'),
  new Product('Bread - Brown Bread', 40, 'Bakery', '/images/bread.jpg', 'Fresh brown bread loaf'),
  new Product('Eggs - Farm Fresh', 120, 'Dairy', '/images/eggs.jpg', '12 pieces farm fresh eggs'),
  new Product('Banana - Robusta', 80, 'Fruits', '/images/banana.jpg', 'Fresh Robusta bananas 1kg'),
  new Product('Onion - Red', 45, 'Vegetables', '/images/onion.jpg', 'Fresh red onions 1kg'),
  new Product('Tomato - Hybrid', 60, 'Vegetables', '/images/tomato.jpg', 'Fresh hybrid tomatoes 1kg'),
  new Product('Rice - Basmati', 180, 'Grains', '/images/rice.jpg', 'Premium basmati rice 1kg'),
  new Product('Oil - Sunflower', 150, 'Cooking', '/images/oil.jpg', 'Sunflower cooking oil 1L'),
  new Product('Sugar - White', 50, 'Groceries', '/images/sugar.jpg', 'White sugar 1kg'),
  new Product('Tea - Tata Tea', 240, 'Beverages', '/images/tea.jpg', 'Tata tea premium 1kg'),
  new Product('Maggi Noodles', 48, 'Instant Food', '/images/maggi.jpg', 'Maggi 2-minute noodles 4 pack'),
  new Product('Biscuits - Parle G', 25, 'Snacks', '/images/biscuits.jpg', 'Parle G biscuits family pack')
];

module.exports = { Product, products };