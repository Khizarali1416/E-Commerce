const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/orderModel')

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const user = new User({
          name,
          email,
          password: hash
        });
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.status(201).json({ token });
      })
    })
  }
  catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};




exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    bcrypt.compare(password, user.password, async (err, result) => {
      if (result) {
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

        user.tokens.push({ token });
        await user.save();
        res.json({ token });
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.userId || order.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this order' });
    }

    await Order.findByIdAndDelete(orderId);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserDetails = (req, res) => {
  try {
    const user = req.user; // assuming user is attached to req in authMiddleware
    res.status(200).json({ userId: user._id, email: user.email, name: user.name });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.user._id; 
    console.log(userId)// Assuming req.user is set after authentication middleware
    const user = await User.findById(userId);
   console.log(user)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ userId: user._id });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};