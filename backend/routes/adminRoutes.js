const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAllUsers,productByCategory, createProduct, getAllProducts, getProductById, deleteProduct, editProduct, getAllOrders, updateOrderStatus, getOrdersByEmail } = require('../controllers/adminControllers');
const upload = require('../config/multer')
const adminAuth = require('../middlewares/adminAuth');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

router.get('/users', getAllUsers);

router.post('/products', adminAuth, upload.single('image'), createProduct);
router.get('/products', getAllProducts);
router.get('/product/:productId', getProductById);
router.delete('/product/:productId', adminAuth, deleteProduct);
router.put('/product/:productId', editProduct);

router.get('/orders', getAllOrders);
router.put('/update/status/:orderId', adminAuth, updateOrderStatus);
router.get('/email/:email', adminAuth, getOrdersByEmail)

router.get('/category/:category', productByCategory);

module.exports = router;