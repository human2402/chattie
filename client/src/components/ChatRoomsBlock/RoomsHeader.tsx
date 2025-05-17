import React from 'react'
import { LuMessageCirclePlus } from "react-icons/lu";

type Props = {
  setCreateNewChatMenu: (value: boolean) => void
}

function RoomsHeader({setCreateNewChatMenu}: Props) {
  return (
    <div className='h-12 flex  items-center px-3  border-b-[1px] border-gray-300'>
      <p className='font-bold grow text-blue-800'>ЭТО ЧАТ</p>
      <LuMessageCirclePlus  
        className='h-6 w-6 text-gray-500 hover:text-black transition cursor-pointer'
        onClick={() => setCreateNewChatMenu(true)}
      />
      
    </div>
  )
}

export default RoomsHeader