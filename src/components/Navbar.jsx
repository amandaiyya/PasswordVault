"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowPathIcon, Bars3Icon } from "@heroicons/react/24/outline";
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Navbar() {
  const url = usePathname();
  const isLoggedIn = url === '/vault';
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    setLoading(true);

    axios.post('/api/logout')
    .then(({data}) => {
      if(data.success){
        toast.success(data.message);
        router.replace('/login');
      }
    })
    .catch((error) => toast.error("Logout Failed"))
    .finally(() => setLoading(false));
  };

  return (
    <div className='w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center flex-wrap '>
      <Link href='/vault' className='text-base xs:text-lg sm:text-xl font-bold cursor-pointer'>PasswordVault</Link>

      <div className="space-x-2">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className='sm:text-lg bg-black hover:bg-gray-800 cursor-pointer rounded-md text-white px-2 sm:px-3 py-1 sm:py-2'
          >
            {loading ? (
              <>
                <ArrowPathIcon className="animate-spin w-4 sm:w-5 inline"/>{' '}
                <span>Loading</span>
              </>
            ) : ("Logout")}
          </button>
        ) : (
          <Bars3Icon className="w-6 sm:w-8 cursor-pointer"/>
        )}
      </div>
    </div>
  )
}

export default Navbar;