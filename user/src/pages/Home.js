import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Category from '../components/Category';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const groupProductsByCategory = (products) => {
    return products.reduce((groups, product) => {
      const category = product.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
      return groups;
    }, {});
  };

  const groupedProducts = groupProductsByCategory(products);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <Category />
      <div className="container mx-auto px-4 py-8">
        {Object.keys(groupedProducts).map((category) => (
          <div key={category}>
            <h2 className="text-2xl mt-4 font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {groupedProducts[category].map((product) => (
                <Link key={product._id} to={`/products/${product._id}`}>
                  <div className="border p-4 rounded-lg shadow-lg">
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="h-48 object-contain mb-4 rounded-lg"
                    />
                    <p className="text-lg font-semibold">
                      <span className='text-red-600'>PKR:</span> {product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
