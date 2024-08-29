const express = require('express');
const router = express.Router();
const {getUserCart,addToCart,removeFromCart} = require('../controllers/cartController');
const userAuth = require('../middlewares/authMiddleware')
// POST /api/cart/add
router.post('/add',userAuth, addToCart);

// GET /api/cart/:userId
router.get('/',userAuth, getUserCart);

router.delete('/:productId', userAuth, removeFromCart);


module.exports = router;
