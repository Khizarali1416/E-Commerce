import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      // console.log(`Fetching product with ID: ${productId}`); // Debug log
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/product/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    if (productId && productId !== ':productId') {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
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
            <p className="text-lg"><span className='font-bold'>PKR:</span> {product.price}</p>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <p className="mt-4"><span className='font-bold'>Category:</span> {product.category}</p>
            <div className="mt-5">
              <Link
                to={`/buynow/${product._id}`}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg"
              >
                Buy Now
              </Link>
              <Link
                to={`/addtocart/${product._id}`}
                className="px-3 py-2 bg-black ml-5 text-white rounded-lg"
              >
                Add To Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
   </>
  );
};

export default ProductDetail;
