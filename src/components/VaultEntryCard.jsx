import React from 'react';
import {XMarkIcon} from "@heroicons/react/24/outline";

function VaultEntryCard({
    entry,
    onEdit,
    onDelete,
}) {
  return (
    <div className="bg-amber-200 border w-full max-w-sm rounded-md p-4 shadow-md space-y-2">
        <div className="flex flex-wrap gap-1 justify-end">
            <button
                onClick={onEdit}
                className="outline-none px-3 py-1 text-center bg-black text-white rounded-md cursor-pointer"
            >Edit</button>
            <button
                onClick={onDelete}
                className="outline-none px-2 py-1 text-center rounded-md cursor-pointer"
            ><XMarkIcon className="w-6 h-6"/></button>
        </div>
        <div className="space-y-3">
            <p className="font-semibold">{entry.title}</p>
            <div className="space-x-2">
                <span>Username :</span>
                <span className="p-1 bg-amber-300 border rounded-md">{entry.username}</span>
            </div>
            <div className="space-x-2">
                <span>Password :</span>
                <span className="p-1 bg-amber-300 border rounded-md">{entry.password}</span>
            </div>
            {entry.url !== '' && (
                <div className="space-x-2">
                    <span>URL :</span>
                    <span className="p-1 bg-amber-300 border rounded-md">{entry.url}</span>
                </div>
            )}
            {entry.note !== '' && (
                <div className="space-x-2">
                    <span>Note :</span>
                    <span className="p-1 bg-amber-300 border rounded-md">{entry.note}</span>
                </div>
            )}
            {/* <p>{entry.password}</p>
            <p>{entry.url}</p>
            <p>{entry.note}</p> */}
        </div>
    </div>
  )
}

export default VaultEntryCard
