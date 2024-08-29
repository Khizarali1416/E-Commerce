
const Product = require('../models/productModel');


// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };