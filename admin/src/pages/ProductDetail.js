import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');

    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/products');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
   <>
   <Navbar/>
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="">
          <div className="p-4">
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="w-full h-96 object-contain rounded-lg shadow-lg"
            />
          </div>
          <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">{product.name}</h1>
            <p className="text-lg font-semibold">PKR: {product.price}</p>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="mt-4">Category: {product.category}</p>
            <div className="mt-5 flex space-x-4">
              <Link
                to={`/products/${productId}/edit`}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
   </>
  );
};

export default ProductDetail;
