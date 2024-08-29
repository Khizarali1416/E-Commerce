const Order = require('../models/orderModel');
const Cart = require('../models/cartModel'); 
const Product = require('../models/productModel')

exports.createOrder = async (req, res) => {
  const userId = req.user._id;
  const { name, address, city, items } = req.body;

  console.log('Received order request:', { name, address, city, items });

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided for the order' });
    }

    const products = [];
    let totalAmount = 0;

    for (const item of items) {
      console.log('Processing item:', item);

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      products.push({
        productId: item.productId,
        quantity: item.quantity,
        totalAmount: product.price * item.quantity
      });
      totalAmount += product.price * item.quantity;
    }

    const order = new Order({
      userId,
      products,
      totalAmount,
      name,
      address,
      city
    });

    await order.save();

    await Cart.deleteOne({ userId });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};





exports.viewOwnOrders = async (req, res) => {
  try {
    const userId = req.userId; 

    const orders = await Order.find({ userId }).populate('products.productId', 'name description image price address city');

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Watch Own Order Status
exports.watchOwnOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.viewOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.userId;

    const order = await Order.findOne({ _id: orderId, userId })
      .populate('products.productId', 'name description image price address city') // Populate products' details
      .select('-__v'); // Exclude '__v' field if not needed

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }   

    res.json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user._id; 

    const order = await Order.findOneAndDelete({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};