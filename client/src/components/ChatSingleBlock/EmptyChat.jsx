import React from 'react'
import { PiChatsCircleThin } from "react-icons/pi";
import { useAppContext } from "../../contexts/AppContext";

function EmptyChat() {
  const {setCreateNewChatMenu} = useAppContext()
  return (
    <div className="bg-white h-full w-full flex items-center justify-center text-center">
      <div className='flex flex-col items-center text-gray-600 '>
        <PiChatsCircleThin className='text-gray-500 h-20 w-20 mb-2'/>
        <p>
          Выберете чат <br /> или {" "}
          <span 
            className='text-[#2D81E0] hover:text-blue-800 cursor-pointer'
            onClick={()=>setCreateNewChatMenu(true)}
          >
            создайте новый
          </span> 
        </p>
      </div>
      
    </div>
  )
}

export default EmptyChat
