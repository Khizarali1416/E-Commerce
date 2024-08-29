import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useForm } from 'react-hook-form';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Cart Items:', response);
        setCartItems(response.data.productId || []); // Ensure cartItems is an array even if response.data.productId is undefined
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle the case where cart endpoint returns a 404 status
          console.error('Cart not found, no items in the cart.');
          setCartItems([]); // Set cartItems to an empty array
        } else {
          console.error('Error fetching cart items:', error);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartItems();
  }, []);

  const handleDeleteItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const confirmDelete = window.confirm('Are you sure you want to delete this item from your cart?');
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCartItems(cartItems.filter(item => item.product._id !== productId));
      }
    } catch (error) {
      console.error('Error deleting item from cart:', error);
    }
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return; // Prevent multiple submissions

    try {
      const token = localStorage.getItem('token');
      const orderData = {
        name: data.name,
        address: data.addressLine1,
        city: data.city,
        items: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        }))
      };

      await axios.post('http://localhost:5000/api/orders/create', orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Clear the form and cart after ordering
      reset();
      setCartItems([]);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500">
            <h2 className="text-xl font-semibold">No Products in the Cart</h2>
            <p>Your cart is currently empty. Add some products to your cart to proceed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                  <div className="w-1/4 p-4">
                    <img
                      src={`http://localhost:5000${item.product.image}`}
                      alt={item.product.name}
                      className="w-full h-full shadow-lg object-contain rounded-lg"
                    />
                  </div>
                  <div className="w-full p-4">
                    <h2 className="text-xl font-semibold tracking-tighter line-clamp-2 mb-2">{item.product.name}</h2>
                    <p className="text-lg mb-2 tracking-tighter line-clamp-2">{item.product.description}</p>
                    <p className="mb-2"><span className='font-bold'>Quantity:</span> {item.quantity}</p>
                    <div className='flex justify-between items-center'>
                      <p className="text-lg font-semibold"><span className='font-bold'>Price:</span> {item.product.price * item.quantity}</p>
                      <button onClick={() => handleDeleteItem(item.product._id)} className='bg-red-500 px-3 py-2 text-white rounded-md'>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:col-span-1">
              <div className="w-3/4 ml-36">
                <h2 className="text-xl font-semibold mb-4">Buy Now Information</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                      Name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="name"
                      type="text"
                      placeholder="Name"
                      {...register('name', { required: true })}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addressLine1">
                      Address
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="addressLine1"
                      type="text"
                      placeholder="Address"
                      {...register('addressLine1', { required: true })}
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                      City
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="city"
                      type="text"
                      placeholder="City"
                      {...register('city', { required: true })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button 
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                      disabled={isSubmitting} // Disable button while submitting
                    >
                      {isSubmitting ? 'Submitting...' : 'Buy Now'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
