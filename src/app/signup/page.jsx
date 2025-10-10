"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import {ArrowPathIcon} from "@heroicons/react/24/outline";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import deriveEncryptionKey, { generateSalt } from '@/helpers/DeriveEncryptionKey';
import { encryptData } from '@/helpers/DataEncryption';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const salt = generateSalt();
    const key = await deriveEncryptionKey(password, salt);
    const vaultTest = await encryptData({test: "password-vault"}, key);

    console.log(salt, key, vaultTest);

    axios.post("/api/signup",{
      email,
      password,
      salt,
      vaultTest
    })
    .then(({data}) => {
      if(data.success) {
        setEmail("");
        setPassword("");
        toast.success(data.message);
        router.replace('/login');
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
      <h1 className='text-center text-lg sm:text-2xl font-semibold'>Sign up</h1>
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
        Already have an account?{' '}
        <Link 
          href='/login'
          className="text-blue-600"
        >Login</Link>
      </p>
    </div>
  )
}

export default SignupPage;