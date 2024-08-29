import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Navbar from '../components/Navbar';
import CartPopup from '../components/CartPopup';

const BuyNowPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchProductAndCart = async () => {
      try {
        const productResponse = await axios.get(`http://localhost:5000/api/admin/product/${productId}`);
        setProduct(productResponse.data);
  
        const cartResponse = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        const cartItems = Array.isArray(cartResponse.data.productId) ? cartResponse.data.productId : [];
        console.log('Fetched Cart Items:', cartItems);
        setCartItems(cartItems);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        setCartItems([]);
        setLoading(false);
      }
    };
  
    fetchProductAndCart();
  }, [productId, location.search]);
  

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleBuyNow = () => {
    setShowCartPopup(true);
  };

  const handleCheckout = async (formValues, selectedItems) => {
    try {
      setButtonDisabled(true);
  
      const itemsForOrder = [...selectedItems.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      })), {
        productId: product._id,
        quantity: quantity
      }];
  
      const orderData = {
        name: formValues.name,
        address: formValues.addressLine1,
        city: formValues.city,
        items: itemsForOrder
      };
  
      console.log('Order Data:', orderData);
  
      await axios.post('http://localhost:5000/api/orders/create', orderData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      setOrderSuccess(true);
      setErrorText('');
  
      setTimeout(() => {
        navigate(`/products/${productId}`);
      }, 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      setErrorText('Failed to place order. Please try again.');
    } finally {
      setButtonDisabled(false);
    }
  };

  const onSubmit = (data) => {
    const selectedItems = cartItems.filter(item => item.selected);

    if (selectedItems.length === 0 && quantity <= 0) {
      setErrorText('No items selected for purchase.');
      return;
    }

    handleCheckout(data, selectedItems);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Navbar />
      {orderSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-auto max-w-full rounded-lg shadow-lg">
          <p className="font-bold">Order placed successfully!</p>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-4">
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="w-full h-full object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 p-4">
              <h1 className="text-2xl font-semibold mb-4 line-clamp-4 tracking-tighter">{product.name}</h1>
              <p className="text-lg"><span className="font-bold">Price:</span> {product.price}</p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Quantity:</label>
                <input
                  type="number"
                  className="mt-1 block w-full md:w-32 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={quantity}
                  min="1"
                  onChange={handleQuantityChange}
                />
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                {errorText && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow-lg">
                    <p className="font-bold">{errorText}</p>
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {errors.name && <span className="text-red-600">{errors.name.message}</span>}
                </div>
                <div className="mt-4">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    id="addressLine1"
                    type="text"
                    {...register('addressLine1', { required: 'Address is required' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {errors.addressLine1 && <span className="text-red-600">{errors.addressLine1.message}</span>}
                </div>
                <div className="mt-4">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    id="city"
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {errors.city && <span className="text-red-600">{errors.city.message}</span>}
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    className={`w-full bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={buttonDisabled}
                    onClick={handleBuyNow}
                  >
                    {buttonDisabled ? 'Processing...' : 'Buy Now'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showCartPopup && (
        <CartPopup
          items={cartItems}
          onCheckout={(selectedItems) => handleCheckout(getValues(), selectedItems)}
          onClose={() => setShowCartPopup(false)}
          initialProduct={product} // Pass the product to the popup
        />
      )}
    </>
  );
};

export default BuyNowPage;
