import React, { useRef, useState } from 'react'
import { GoSearch } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";

function ChatsSearch({searchInputValue, setSearchInputValue}) {
    //to make the whole div activate the input
    const inputRef = useRef(null);
    const focusInput = () => {
        inputRef.current?.focus();
    };
  
    return (
    <div 
        className='mb-2 mx-4 bg-[#EBEDF0] rounded-md hover:bg-gray-200 transition-colors flex items-center cursor-text'
        onClick={focusInput}
    >
        <GoSearch className='ml-3 h-5 w-5  text-[#7576a2]'/>
        <input 
            ref={inputRef}
            className=' border-0 pr-4 pl-2 py-2 w-full focus:outline-0' 
            onChange={ e => setSearchInputValue(e.target.value) } 
            value={ searchInputValue }
            placeholder='Поиск'
        />
        {searchInputValue&&(
            <IoCloseOutline 
                onClick={() => setSearchInputValue('')}
                className='ml-2 h-7 w-7 mr-2 text-[#7576a2] cursor-pointer'
            />
        )}
        
    </div>
  )
}

export default ChatsSearch
