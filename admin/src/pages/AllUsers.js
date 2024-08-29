import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        setUsers(response.data);
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='pl-10 mt-5 '>
        <h1 className='font-extrabold text-2xl'>All Users</h1>
        <ul className='mt-3 flex flex-wrap'>
          {users.map((user) => (
            <div key={user._id} className='w-48 p-3 mr-4 border-2'>
              <li className='tracking-tighter' >{user.name}</li>
              <li className='tracking-tighter'>{user.email}</li>

            </div>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AllUsers;
