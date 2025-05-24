import React from 'react'
import ConnectionManager from './ConnectionManager'

function Menu({setDisplayMenu}) {
  return (
    <div 
        className="fixed inset-0 bg-black/20 z-50 flex justify-end items-start p-4"
        onClick={() => setDisplayMenu(false)}
    >
        <div className="bg-white absolute top-12 left-2 rounded-lg shadow-lg w-64 p-1">

            <button
                className="block w-full text-left px-2 py-2 rounded-lg hover:bg-gray-100"
                onClick={() => {
                console.log("Profile clicked");
                }}
            >
                Профиль
            </button>

            <button
                className="block w-full text-left px-2 py-2 rounded-lg text-red-500 hover:bg-gray-100"
                onClick={() => {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.reload();
                }}
            >
                Выйти
            </button>
            
            <ConnectionManager />
    </div>
  </div>
  )
}

export default Menu
