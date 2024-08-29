// src/components/Category.js

import React from 'react';
import { Link } from 'react-router-dom';

const Category = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-between space-x-6">
        <li>
          <Link to="/category/bags" className="hover:text-gray-400">Bags</Link>
        </li>
        <li>
          <Link to="/category/shoes" className="hover:text-gray-400">Shoes</Link>
        </li>
        <li>
          <Link to="/category/clothes" className="hover:text-gray-400">Clothes</Link>
        </li>
        <li>
          <Link to="/category/rings" className="hover:text-gray-400">Rings</Link>
        </li>
        <li>
          <Link to="/category/watch" className="hover:text-gray-400">Watches</Link>
        </li>
        <li>
          <Link to="/category/bracelet" className="hover:text-gray-400">Bracelets</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Category;
