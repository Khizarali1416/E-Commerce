import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProductUploadForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('category', data.category);
      formData.append('image', data.image[0]);

      const response = await axios.post('http://localhost:5000/api/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setMessage('Product uploaded successfully');
        reset(); // Clear the form fields
        setIsSubmitting(false);
        setTimeout(() => {
          setMessage('');
          navigate('/products');
        }, 3000); // Clear message after 3 seconds and navigate to products page
      } else {
        setMessage('Product upload failed');
        console.error('Upload failed:', response.data.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      setMessage('Error uploading product');
      console.error('Error during upload:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold flex justify-center mb-6">Upload Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" {...register('name', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.name && <span className="text-red-500">Name is required</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" {...register('description', { required: true })} className="mt-1 resize-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.description && <span className="text-red-500">Description is required</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" id="price" {...register('price', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.price && <span className="text-red-500">Price is required</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input type="text" id="category" {...register('category', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.category && <span className="text-red-500">Category is required</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input type="file" id="image" {...register('image', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            {errors.image && <span className="text-red-500">Image is required</span>}
          </div>
          <button
            type="submit"
            className={`w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </button>
        </form>
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </>
  );
};

export default ProductUploadForm;
