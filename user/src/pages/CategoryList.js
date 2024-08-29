import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Category from '../components/Category';

const CategoryList = () => {
  const { category } = useParams(); // Get the category from the URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products for category:', category); // Log the category being fetched
        const response = await axios.get(`http://localhost:5000/api/admin/category/${category}`);
        console.log('Response data:', response.data); // Log API response
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error); // Log any errors
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <Category />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">
         {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`} className="block">
                <div className="border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="h-48 w-full object-contain mb-4 rounded-lg"
                  />
                  <p className="text-lg font-semibold mb-2"><span className='text-red-600'>PKR:</span> {product.price}</p>
                </div>
              </Link>
            ))
          ) : (
            <p>No products found in this category.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryList;
