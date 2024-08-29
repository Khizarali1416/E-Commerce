import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <div className='navbar bg-zinc-900 p-7 w-full'>
        <div className="flex justify-between">
          <div>
            <Link to='' className='text-white font-bold text-2xl'>Admin Dashboard</Link>
          </div>
          <div>
            <ul className="flex space-x-4 mt-1">
              <li><Link to="/users" className="text-white hover:text-gray-300">Users</Link></li>
              <li><Link to="/products" className="text-white hover:text-gray-300">Products</Link></li>
              <li><Link to="/orders" className="text-white hover:text-gray-300">Orders</Link></li>
              <li><Link to="/upload" className="text-white bg-blue-500 px-3 py-2 rounded-md hover:text-gray-300">Upload</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
