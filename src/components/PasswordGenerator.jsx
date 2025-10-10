"use client";
import generatePassword from "@/helpers/GeneratePassword";
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React, { useState } from 'react';
import toast from "react-hot-toast";

function PasswordGenerator() {
  const [password, setPassword] = useState("");

  const [passwordLength, setPasswordLength] = useState(5);
  const [numbersCheck, setNumbersCheck] = useState(true);
  const [lettersCheck, setLettersCheck] = useState(true);
  const [symbolsCheck, setSymbolsCheck] = useState(true);
  const [excludeCheck, setExcludeCheck] = useState(false);

  const [openAdjustment, setOpenAdjustment] = useState(false);

  const handleSubmit = () => {
    const generatedPassword = generatePassword(
      passwordLength, 
      numbersCheck, 
      lettersCheck, 
      symbolsCheck, 
      excludeCheck
    );

    setPassword(generatedPassword);
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password Copied!");

      setTimeout(async () => {
        setPassword("")
        await navigator.clipboard.writeText("");
      }, 20000);
    } catch (error) {
      toast.error("Failed Copying password!")
    }
  }

  return (
    <div className="w-full max-w-lg rounded-md p-4 shadow-md space-y-3">
      <div className="flex items-center">
        <input
          type="text" 
          className="flex-1 outline-none rounded-l-md bg-gray-100 p-2" 
          placeholder="Generate a password"
          value={password}
          disabled
        />
        <button 
          onClick={handleCopy}
          className="w-auto p-2 rounded-r-md cursor-pointer bg-gray-200 hover:bg-gray-200/80"
        >Copy
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSubmit}
          className="w-full text-base sm:text-lg bg-black hover:bg-gray-800 cursor-pointer rounded-md text-white px-2 sm:px-3 py-2"
        >
          Generate
        </button>
        <button
          onClick={() => setOpenAdjustment(prev => !prev)}
          className="cursor-pointer" 
        >
          {openAdjustment ? (
            <XMarkIcon className="w-6"/>
          ) : (
            <AdjustmentsHorizontalIcon className="w-6"/>
          )}
        </button>
      </div>

      {openAdjustment && <div className="bg-gray-100 rounded-md p-2">
        <div className="w-fit">
          <div className="text-xs flex justify-between">
            <label>Length</label>
            <span>{passwordLength}</span>
          </div>
          <input type="range" min="5" max="50" value={passwordLength} onChange={(e) => setPasswordLength(e.target.value)}/>
        </div>
        <div className="flex justify-between items-center flex-wrap text-sm">
          <div className="space-x-1 flex items-center mx-1">
            <label>Numbers</label>
            <input 
              type="checkbox" 
              checked={numbersCheck} 
              onChange={(e) => setNumbersCheck(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
          <div className="space-x-1 flex items-center mx-1">
            <label>Letters</label>
            <input 
              type="checkbox" 
              checked={lettersCheck} 
              onChange={(e) => setLettersCheck(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
          <div className="space-x-1 flex items-center mx-1">
            <label>Symbols</label>
            <input 
              type="checkbox" 
              checked={symbolsCheck} 
              onChange={(e) => setSymbolsCheck(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
          <div className="space-x-1 flex items-center mx-1">
            <label>Exclude look-alike</label>
            <input 
              type="checkbox" 
              checked={excludeCheck} 
              onChange={(e) => setExcludeCheck(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
        </div>
      </div>}
    </div>
  )
}

export default PasswordGenerator;
