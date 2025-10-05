"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {};

  return (
    <div className='w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center flex-wrap '>
      <Link href='/vault' className='text-base xs:text-lg sm:text-xl font-bold cursor-pointer'>PasswordVault</Link>

      <div className="space-x-2">
        {false ? (
          <button
            onClick={handleLogout}
            className='sm:text-lg bg-black hover:bg-gray-800 cursor-pointer rounded-md text-white py-1 px-3 sm:py-1 sm:px-2'
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.replace("/login")}
            className='sm:text-lg bg-black hover:bg-gray-800 cursor-pointer rounded-md text-white py-1 px-3 sm:py-1 sm:px-2'
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar;