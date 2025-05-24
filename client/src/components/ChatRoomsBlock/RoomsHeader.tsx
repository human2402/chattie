import React from 'react'
import { LuMessageCirclePlus } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";

type Props = {
  setCreateNewChatMenu: (value: boolean) => void,
  setDisplayMenu: (value: boolean) => void
}

function RoomsHeader({setCreateNewChatMenu, setDisplayMenu}: Props) {
  return (
    <div className='h-12 flex  items-center px-3  '>
      <GiHamburgerMenu 
        className='h-5 w-5 text-gray-500 hover:text-black transition cursor-pointer'
        onClick={() => setDisplayMenu(prev => (!prev))}
      />

      <p className='font-bold grow text-blue-800 ml-3 '>Мессенджер</p>

      <LuMessageCirclePlus  
        className='h-6 w-6 text-gray-500 hover:text-black transition cursor-pointer'
        onClick={() => setCreateNewChatMenu(true)}
      />
      
    </div>
  )
}

export default RoomsHeader