import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', data);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setMessage('User logged in successfully');
        setTimeout(() => {
          setMessage('');
          navigate('/home');
        }, 2000); // Clear message and redirect after 2 seconds
      } else {
        setMessage('Error logging in user');
      }
    } catch (error) {
      setMessage('Error logging in user');
      console.error('Error logging in user:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 md:p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.email && <p className="text-red-600 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && <p className="text-red-600 mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserLoginPage;
