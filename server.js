const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name');

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);

// Get cart
app.get('/api/cart/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart || { items: [], total: 0 });
});

// Add to cart
app.post('/api/cart', async (req, res) => {
  const { userId, item } = req.body;
  let cart = await Cart.findOne({ userId });
  
  if (!cart) {
    cart = new Cart({ userId, items: [item], total: item.price * item.quantity });
  } else {
    cart.items.push(item);
    cart.total += item.price * item.quantity;
  }
  
  await cart.save();
  res.json(cart);
});

// Update cart item
app.put('/api/cart/:userId/:productId', async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ userId: req.params.userId });
  const item = cart.items.find(i => i.productId === req.params.productId);
  
  if (item) {
    cart.total -= item.price * item.quantity;
    item.quantity = quantity;
    cart.total += item.price * quantity;
    await cart.save();
  }
  
  res.json(cart);
});

// Delete cart item
app.delete('/api/cart/:userId/:productId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  const itemIndex = cart.items.findIndex(i => i.productId === req.params.productId);
  
  if (itemIndex > -1) {
    cart.total -= cart.items[itemIndex].price * cart.items[itemIndex].quantity;
    cart.items.splice(itemIndex, 1);
    await cart.save();
  }
  
  res.json(cart);
});

app.listen(3000, () => console.log('Server running on port 3000'));
