const express = require('express');
const router = express.Router();
const { registerUser, loginUser, deleteOrder,getUserDetails,getUser } = require('../controllers/userControllers');
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/order/:orderId', authMiddleware, deleteOrder);
router.get('/', authMiddleware, getUserDetails);
router.get('/', authMiddleware, getUser);

module.exports = router;