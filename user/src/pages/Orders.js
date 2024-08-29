import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Order = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/orders/order`, {
          params: { userId },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        // Sort orders by creation date in descending order
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log(response)
        setOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/userlogin');
          console.log('Unauthorized access. Redirect to login page.');
        } else {
          console.error('Error fetching user orders:', error);
        }
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [userId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No orders available</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{order._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap">
                          {order.products.map(product => (
                            <div key={product._id} className="flex items-center mb-2 mr-2">
                              <img src={`http://localhost:5000${product.productId.image}`} alt={product.productId.name} className="w-12 h-12 object-contain" />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{order.totalAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/orderdetail/${order._id}`} className="text-blue-500 hover:text-blue-700">Manage</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Order;
