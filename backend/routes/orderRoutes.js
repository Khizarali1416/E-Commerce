const express = require('express');
const router = express.Router();
const { createOrder, viewOwnOrders, watchOwnOrderStatus ,viewOrderDetails,deleteOrder} = require('../controllers/orderControllers');
const userAuth = require('../middlewares/authMiddleware')

router.post('/create', userAuth, createOrder);
router.get('/order', userAuth, viewOwnOrders);
router.get('/order/:orderId', userAuth, viewOrderDetails);
router.delete('/order/:orderId', userAuth, deleteOrder); // Add this line
router.get('/order/status/:orderId', userAuth, watchOwnOrderStatus);

module.exports = router