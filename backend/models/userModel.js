// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  tokens: [{ token: { type: String, required: true } }],

  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, {
  timestamps: true
});


const User = mongoose.model('User', userSchema);

module.exports = User;
