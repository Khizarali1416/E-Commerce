import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const BuyNowPage = () => {
  const { productId } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // Default quantity, can be adjusted by user

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/product/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const onSubmit = async (data) => {
    try {
      const orderData = {
        products: [{ product: productId, quantity: quantity }],
        address: {
          name: data.name,
          addressLine1: data.addressLine1,
          city: data.city,
        },
        totalAmount: product.price * quantity,
      };

      const response = await axios.post('http://localhost:5000/api/orders/create', orderData);

      console.log('Order created:', response.data);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex">
        <div className="w-1/2 p-4">
          <img
            src={`http://localhost:5000${product.image}`} alt={product.name}
            className="w-full h-auto object-contain rounded-lg shadow-lg"
          />
        </div>
        <div className="w-1/2 p-4">
          <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
          <p className="text-lg font-semibold">Price: {product.price}</p>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Quantity:</label>
            <input
              type="number"
              className="mt-1 block w-full border border-zinc-500 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="mt-1 block w-full border border-zinc-500 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div className="mt-4">
              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                id="addressLine1"
                type="text"
                {...register('addressLine1', { required: 'Address Line 1 is required' })}
                className="mt-1 block w-full border border-zinc-500 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.addressLine1 && <p className="text-red-500">{errors.addressLine1.message}</p>}
            </div>
            <div className="mt-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                id="city"
                type="text"
                {...register('city', { required: 'City is required' })}
                className="mt-1 block w-full border border-zinc-500 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              {errors.city && <p className="text-red-500">{errors.city.message}</p>}
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Buy Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyNowPage;
