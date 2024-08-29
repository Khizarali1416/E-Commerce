import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AddToCartPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('Add to Cart');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/product/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (quantity < 1) {
      setMessage('Quantity must be at least 1');
      return;
    }
  
    setButtonText('Adding...');
    setIsButtonDisabled(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity },
        { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
      );
      setMessage('Product added to cart successfully');
      setTimeout(() => {
        setMessage('');
        navigate('/cart'); // Redirect to cart page
      }, 3000);
    } catch (error) {
      setMessage('Error adding product to cart');
      console.error('Error adding product to cart:', error);
    } finally {
      setButtonText('Add to Cart');
      setIsButtonDisabled(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {message && (
            <div className={`text-center py-2 ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          <div className="flex">
            <div className="w-1/2 p-4">
              <img
                src={`http://localhost:5000${product.image}`} alt={product.name}
                className="w-full h-full object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="w-1/2 p-4">
              <h1 className="text-2xl font-semibold mb-4 line-clamp-4">{product.name}</h1>
              <p className="text-lg"><span className='font-bold'>Price:</span> {product.price}</p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Quantity:</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={quantity}
                  min="1"
                  onChange={handleQuantityChange}
                />
              </div>
              <div className="mt-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isButtonDisabled}
                >
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToCartPage;
