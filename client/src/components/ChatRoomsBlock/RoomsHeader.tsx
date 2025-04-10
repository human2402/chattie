import React from 'react'
import { LuMessageCirclePlus } from "react-icons/lu";

type Props = {
  setCreateNewChatMenu: (value: boolean) => void
}

function RoomsHeader({setCreateNewChatMenu}: Props) {
  return (
    <div className='h-12 flex  items-center mx-3'>
      <p className='font-bold grow text-blue-800'>МЕССЕНДЖЕР.BGU-CHITA</p>
      <LuMessageCirclePlus  
        className='h-6 w-6 text-gray-500 hover:text-black transition cursor-pointer'
        onClick={() => setCreateNewChatMenu(true)}
      />
      
    </div>
  )
}

export default RoomsHeader