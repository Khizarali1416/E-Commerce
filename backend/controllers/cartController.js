const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// POST /api/cart/add
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid productId or quantity' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, productId: [] });
    }

    const index = cart.productId.findIndex(item => item.product.equals(productId));
    if (index !== -1) {
      cart.productId[index].quantity = quantity; // Update quantity
    } else {
      cart.productId.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};
// GET /api/cart
exports.getUserCart = async (req, res) => {
  const userId = req.user._id;
  // console.log('Fetching cart for user:', userId); // Add logging

  try {
    const cart = await Cart.findOne({ userId }).populate('productId.product');
    // console.log('Cart found:', cart); // Add logging
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    console.error('Error fetching user cart:', error);
    res.status(500).json({ error: 'Failed to fetch user cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find index of item in cart
    const index = cart.productId.findIndex(item => item.product.equals(productId));

    if (index !== -1) {
      // Remove item from cart array
      cart.productId.splice(index, 1);
      await cart.save();
      res.status(200).json({ message: 'Item removed from cart' });
    } else {
      res.status(404).json({ error: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};