const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();
const app = express()
connectDB();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'));

//Routes
const adminRoute = require('./routes/adminRoutes')
const userRoute = require('./routes/userRoutes')
const orderRoute = require('./routes/orderRoutes')
const productRoute = require('./routes/productRoutes')
const cartRoutes = require('./routes/cartRoutes')

app.use('/api/admin', adminRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/orders', orderRoute)
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

