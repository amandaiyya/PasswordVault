"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import {ArrowPathIcon} from "@heroicons/react/24/outline";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUserContext } from '@/context/userContext';
import deriveEncryptionKey from '@/helpers/DeriveEncryptionKey';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const {setKey} = useUserContext();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post("/api/login",{
      email,
      password
    })
    .then(async ({data}) => {
      if(data.success) {
        const key = await deriveEncryptionKey(password, data.user.salt);
        setKey(key);
        
        setEmail("");
        setPassword("");
        
        toast.success(data.message);
        router.replace('/vault');
      }
    })
    .catch(({response}) => {
      const errorMessage = response.data.message;
      toast.error(errorMessage);
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className='mt-10 mx-auto w-full max-w-lg p-4 sm:p-5 rounded-md shadow-sm border border-sky-100 space-y-3 sm:space-y-5'>
      <h1 className='text-center text-lg sm:text-2xl font-semibold'>Login</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className='space-y-3'>
          <div>
            <label htmlFor="email" className="block text-base sm:text-lg font-medium mb-1">Email</label>
            <input 
              id="email"
              type="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none border-2 rounded-md py-1 px-3 sm:text-lg font-medium"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-base sm:text-lg font-medium mb-1">Password</label>
            <input 
              id="password"
              type="password"
              placeholder="enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none border-2 rounded-md py-1 px-3 sm:text-lg font-medium"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full text-base sm:text-lg bg-black hover:bg-gray-800 cursor-pointer rounded-md text-white px-2 sm:px-3 py-2"
        >
          {loading ? (
            <>
              <ArrowPathIcon className="animate-spin w-4 sm:w-5 inline"/>{' '}
              <span>Loading</span>
            </>
          ) : ("Submit")}
        </button>
      </form>
      <p className="text-center text-sm sm:text-base mt-8">
        Don't have any account?{' '}
        <Link 
          href='/signup'
          className="text-blue-600"
        >Signup</Link>
      </p>
    </div>
  )
}

export default LoginPage;