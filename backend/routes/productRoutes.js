const express = require('express');
const router = express.Router();
const { getAllProducts } = require('../controllers/productControllers')
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/product', authMiddleware, getAllProducts)

module.exports = router