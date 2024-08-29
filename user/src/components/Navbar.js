import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="navbar bg-zinc-900 p-4 md:p-7 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">
          <Link to="/home" className="text-white font-bold text-2xl">E-Commerce</Link>
        </div>
        <div>
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-1">
            <li><Link to="/home" className="text-white hover:text-gray-300">Home</Link></li>
            <li><Link to="/orders" className="text-white hover:text-gray-300">Orders</Link></li>
            <li><Link to="/cart" className="text-white hover:text-gray-300">Cart</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
