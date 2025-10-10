"use client";
import React, { useEffect, useMemo, useState } from 'react';
import PasswordGenerator from '@/components/PasswordGenerator';
import axios from 'axios';
import { useUserContext } from '@/context/userContext';
import deriveEncryptionKey from '@/helpers/DeriveEncryptionKey';
import { decryptData, encryptData } from '@/helpers/DataEncryption';
import toast from 'react-hot-toast';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import VaultEntryCard from '@/components/VaultEntryCard';
import useDebounce from '@/helpers/useDebounce';

function VaultPage() {
  const {key, setKey} = useUserContext();

  const [verificationPassword, setVerificationPassword] = useState("");

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("view");
  const [editingEntry, setEditingEntry] = useState(null);

  const [vaultEntries, setVaultEntries] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const deboundedSearch = useDebounce(searchQuery, 300);

  const fetchEntries = async () => {
    try {
      const {data} = await axios.get('/api/vault');

      if(data.success) {
        const encryptedEntries = data.data;
        const decryptedEntries = [];

        for(let i = 0; i < encryptedEntries.length; i++){
          let decryptedEntry = await decryptData(JSON.parse(encryptedEntries[i].data), key);
          decryptedEntries.push({...encryptedEntries[i], data: decryptedEntry});
        }

        setVaultEntries(decryptedEntries);
        toast.success(data.message);
      }
    } catch (error) {
      if(axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || "server Error";
        toast.error(msg);
      } else {
        console.log(error)
        toast.error("Failed fetching vault's entries");
      }
    }
  }

  const filteredEntries = useMemo(() => {
    const query = deboundedSearch.toLowerCase().trim();
    
    if(!query) return vaultEntries;

    return vaultEntries.filter((entry) => (
      entry.data.title.toLowerCase().includes(query)
    ));
  }, [vaultEntries, deboundedSearch]);

  const handleVaultVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {data} = await axios.get('/api/getVerifyInfo');

      if(data.success) {
        const newKey = await deriveEncryptionKey(verificationPassword, data.info.salt);
        const decrypted = await decryptData(data.info.vaultTest, newKey);
        if(decrypted.test === "password-vault") {
          setKey(newKey);
          toast.success("Vault verified successfully")
        } else {
          toast.error("Incorrect Password");
        }
      }
    } catch (error) {
        if(axios.isAxiosError(error)) {
          const msg = error.response?.data?.message || "server Error";
          toast.error(msg);
        } else {
          toast.error("Incorrect Password");
        }
    } finally {
        setLoading(false);
    }
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const encrypted = await encryptData({
        title,
        username,
        password,
        url,
        note
      }, key);

      let data = null;
      
      if(editingEntry) {
        const response = await axios.put(`/api/vault/${editingEntry}`, {data: JSON.stringify(encrypted)});
        data = response.data;
      } else {
        const response = await axios.post('/api/vault', {data: JSON.stringify(encrypted)});
        data = response.data;
      }

      if(data.success) {
        setTitle("");
        setUsername("");
        setPassword("");
        setUrl("");
        setNote("");
        setEditingEntry(null);
        fetchEntries();
        toast.success(data.message);
      }
    } catch (error) {
        if(axios.isAxiosError(error)) {
          const msg = error.response?.data?.message || "server Error";
          toast.error(msg);
        } else {
          toast.error("Failed saving vault entry");
        }
    } finally {
        setLoading(false);
    }
  }

  const handleDelete = (id) => {
    axios.delete(`/api/vault/${id}`)
    .then(({data}) => {
        if(data.success) {
          fetchEntries();
          toast.success(data.message);
        }
    })
    .catch(({response}) => {
      const errorMessage = response.data.message;
      toast.error(errorMessage);
    })
  }

  useEffect(() => {
    if(key) {
      fetchEntries();
    }
  },[key]);

  return (
    <div className='mx-auto w-full flex flex-col items-center'>
      {!key ? (
        <>
          <div className='mt-10 mx-auto w-full max-w-lg p-4 sm:p-5 rounded-md shadow-sm border border-sky-100 space-y-3 sm:space-y-5'>
            <h1 className='text-center text-lg sm:text-xl font-semibold'>Vault's Verification</h1>
            <form onSubmit={handleVaultVerification} className="space-y-5">
              <div className='space-y-3'>
                <div>
                  <label htmlFor="verificationPassword" className="block text-base sm:text-lg font-medium mb-1">Password</label>
                  <input 
                    id="verificationPassword"
                    type="password"
                    placeholder="enter password same as login"
                    value={verificationPassword}
                    onChange={(e) => setVerificationPassword(e.target.value)}
                    className="w-full outline-none border-2 rounded-md py-1 px-3 sm:text-lg font-medium"
                    required
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
                ) : ("Verify")}
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="w-[100px] rounded-md inset-shadow-sm inset-shadow-amber-300/50 p-1 mb-10 bg-amber-300 flex items-center text-center">
            <button 
              onClick={() => setSelected("view")}
              className={`w-1/2 rounded-sm cursor-pointer ${selected === "view" && "bg-amber-400"}`}
            >View</button>
            <button 
              onClick={() => setSelected("add")}
              className={`w-1/2 rounded-sm cursor-pointer ${selected === "add" && "bg-amber-400"}`}
            >Add</button>
          </div>

          <div className="w-full max-w-3xl flex flex-col items-center gap-4 space-y-3 overflow-y-auto h-full">
            {selected === "add" ? (
              <>
                <PasswordGenerator />
                <div className='mt-10 mx-auto w-full max-w-lg p-4 sm:p-5 rounded-md shadow-sm border border-sky-100 space-y-3 sm:space-y-5'>
                  <h1 className='text-center text-lg sm:text-xl font-semibold'>Save Entry</h1>
                  <form onSubmit={handleSave} className="space-y-5">
                    <div className='space-y-3'>
                      <div>
                        <label htmlFor="title" className="block text-base sm:text-lg font-medium mb-1">Title</label>
                        <input 
                          id="title"
                          type="text"
                          placeholder="enter title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full outline-none border-2 rounded-md py-1 px-3 sm:text-lg font-medium"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="username" className="block text-base sm:text-lg font-medium mb-1">Username</label>
                        <input 
                          id="username"
                          type="text"
                          placeholder="enter username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full outline-none border-2 rounded-md py-1 px-3 sm:text-lg font-medium"
                          required
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
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="url" className="block text-base sm:text-lg font-medium mb-1">URL</label>
                        <input 
                          id="url"
                          type="text"
                          placeholder="enter url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="w-full outline-none border-2 rounded-md py-1 px-3 sm:text-lg font-medium"
                        />
                      </div>
                      <div>
                        <label htmlFor="note" className="block text-base sm:text-lg font-medium mb-1">Note</label>
                        <input 
                          id="note"
                          type="text"
                          placeholder="enter note"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
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
                      ) : ("Save")}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="w-full max-w-lg shadow-xl rounded-md p-4 border border-sky-100">
                    <input
                      type="text" 
                      className="w-full outline-none rounded-md bg-gray-100 p-2" 
                      placeholder="search eg; netflix"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="w-full max-w-3xl flex flex-col items-center gap-3">
                  {filteredEntries.length <= 0 ? (
                    <>
                      <p>No Entries Found</p>
                    </>
                  ) : (
                    filteredEntries.map((entry) => (
                      <VaultEntryCard 
                        key={entry._id}
                        entry={entry.data}
                        onEdit={() => {
                          setTitle(entry.data.title);
                          setUsername(entry.data.username);
                          setPassword(entry.data.password);
                          setUrl(entry.data.url);
                          setNote(entry.data.note);
                          setEditingEntry(entry._id);
                          setSelected("add");
                        }}
                        onDelete={() => handleDelete(entry._id)}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
      
    </div>
  )
}

export default VaultPage;
