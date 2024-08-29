
const Admin = require('../models/adminModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const removeProductFromCarts = require('../utils/removeProductFromCarts')

//Register Admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const admin = new Admin({
          name,
          email,
          password: hash
        });
        await admin.save();

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);
        console.log("Admin register token : ", token)
        res.status(201).json({ token });
      })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



//Login Admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    bcrypt.compare(password, admin.password, async (err, result) => {
      if (result) {
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);
        console.log("admin login token : ", token)
        admin.tokens.push({ token });
        await admin.save();
        res.json({ token });
      }
    })

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const adminId = req.admin.id;
  const image = `/uploads/${req.file.filename}`;

  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      adminId
    });

    await product.save();

    await Admin.findByIdAndUpdate(adminId, { $push: { products: product._id } });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


//Edit Product
exports.editProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, category } = req.body;

  try {
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

     removeProductFromCarts;

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrdersByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await Order.find().populate('userId');
    const filteredOrders = orders.filter(order => order.userId.email === email);

    if (filteredOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this email.' });
    }
    res.json(filteredOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.productByCategory = async (req, res) => {
  const { category } = req.params;


  try {
    // Normalize category to lowercase
    const normalizedCategory = category.trim().toLowerCase();


    // Use case-insensitive regex for category search
    const products = await Product.find({
      category: { $regex: new RegExp(`^${normalizedCategory}$`, 'i') } // Exact match
    });

    

    res.status(200).json(products); // Send response
  } catch (error) {
    console.error('Error during database query:', error); // Log error
    res.status(500).json({ message: 'Server error', error });
  }
};



