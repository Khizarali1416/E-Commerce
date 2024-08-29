const User = require('../models/userModel')


exports.removeProductFromCarts = async (productId) => {
    try {
      const users = await User.find({ 'cart.product': productId });
  
      for (const user of users) {
        user.cart = user.cart.filter(cartItem => cartItem.product.toString() !== productId);
        await user.save();
      }
    } catch (error) {
      console.error('Error removing product from carts:', error);
    }
  };