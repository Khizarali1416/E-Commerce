import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false); // State to manage alert message
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/orders/order/${orderId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response)
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setLoading(false);
      }
    };
  
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleDeleteOrder = async () => {
    const confirmDelete = window.confirm('Are you sure you want to cancel this order?');
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
       await axios.delete(`http://localhost:5000/api/orders/order/${orderId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setShowAlert(true); // Show alert message
        // Automatically hide alert message after 2 seconds
        setTimeout(() => {
          setShowAlert(false);
          navigate('/orders'); // Redirect to orders page
        }, 2000);
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  // const formatAddress = (address) => {
  //   if (!address) return 'Address not available';
  //   if (typeof address === 'object' && !Array.isArray(address)) {
  //     // Convert object to string representation
  //     return Object.entries(address)
  //       .map(([key, value]) => `${key}: ${value}`)
  //       .join(', ');
  //   } else {
  //     return address; // Assume address is already a string if not an object
  //   }
  // };

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Order Details</h1>
      {order.products.map(product => (
        <div key={product._id} className="flex flex-col md:flex-row shadow-lg items-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <div className="md:w-1/4">
            <img src={`http://localhost:5000${product.productId.image}`} alt={product.productId.name} className="w-full shadow-md h-40 object-contain" />
          </div>
          <div className="md:w-3/4">
            <h2 className="text-lg font-semibold line-clamp-1">{product.productId.name}</h2>
            <p className="text-sm line-clamp-3">{product.productId.description}</p>
            <p className="text-sm mt-2"><span className='font-bold'>Quantity:</span> {product.quantity}</p>
            <p className="text-sm mt-2"><span className='font-bold'>Price per unit:</span> {product.productId.price}</p>
            <p className="text-sm mt-2"><span className='font-bold'>Total Price:</span> {product.productId.price * product.quantity}</p> {/* Calculate total price */}
          </div>
        </div>
      ))}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Order Information</h2>
        <p><span className='font-bold'>Status:</span> {order.status || 'Status not available'}</p>
        <p><span className='font-bold'>Ordered Date:</span> { new Date(order.createdAt).toLocaleDateString()}</p>
        <p><span className='font-bold'>Location:</span> {order.address}, {order.city}</p>
      </div>
      <button 
        onClick={handleDeleteOrder} 
        className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded"
      >
        Cancel
      </button>
      {showAlert && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8">
            <p className="text-green-500 text-center">Order Cancelled successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
