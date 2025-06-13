import React from 'react'
import { LuMessageCirclePlus } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from '../../assets/bgu-messanger-text.svg';

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

      <img
        alt="БГУ МЕССЕНДЖЕР"
        src={logo}
        className=" w-48 pl-2 pt-1 "
      />

      <div className='grow'></div>

      <LuMessageCirclePlus  
        className='h-6 w-6 text-gray-500 hover:text-black transition cursor-pointer'
        onClick={() => setCreateNewChatMenu(true)}
      />
      
    </div>
  )
}

export default RoomsHeader