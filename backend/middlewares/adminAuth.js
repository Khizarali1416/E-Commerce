const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findOne({ _id: decoded.id });
    if (!admin) {
      throw new Error('Admin not found.');
    }


    const tokenExists = admin.tokens.some((t) => t.token === token);
    if (!tokenExists) {
      throw new Error('Token not matching.');
    }

    req.token = token;
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate as admin.' });
  }
};

module.exports = adminAuth;
