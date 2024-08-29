import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const fetchOrdersByEmail = async () => {
    if (!searchEmail) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Include your token if needed
      const response = await axios.get(
        `http://localhost:5000/api/admin/email/${searchEmail}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchEmail(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrdersByEmail();
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token'); // or however you store your token
      const response = await axios.put(
        `http://localhost:5000/api/admin/update/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleStatusChange = (orderId, e) => {
    updateOrderStatus(orderId, e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
   <>
   <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <input
          type="email"
          value={searchEmail}
          onChange={handleSearchChange}
          placeholder="Search by email"
          className="border border-gray-300 rounded-md p-2"
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-black text-white rounded-lg">
          Search
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">User Email</th>
              <th className="py-2 px-4 border-b">Total Amount</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="py-2 px-4 border-b">{order._id}</td>
                <td className="py-2 px-4 border-b">{order.userId ? order.userId.email : 'No email available'}</td>
                <td className="py-2 px-4 border-b">PKR: {order.totalAmount}</td>
                <td className="py-2 px-4 border-b">
                  <select value={order.status} onChange={(e) => handleStatusChange(order._id, e)} className="border border-gray-300 rounded-md p-2">
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   </>
  );
};


export default AdminOrdersPage;
