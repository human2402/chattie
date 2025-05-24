import { useState } from "react"
import ChatRoomsList from "./ChatRoomsList"
import ChatsSearch from "./ChatsSearch"
import RoomsHeader from "./RoomsHeader"
import ChatCreate from "./ChatCreate"
import Menu from './Menu.jsx'
import { useActionData } from "react-router"
import { useAppContext } from "../../contexts/AppContext.js"



function ChatRoomsBlock() {
  const {isCreateNewChatMenu, setCreateNewChatMenu} = useAppContext()
  const [displayMenu, setDisplayMenu] = useState<boolean> (false) 
  const [searchInputValue, setSearchInputValue] = useState<string> ('') 

  return (
    <div className="min-w-90 h-full border-r-[1px] border-gray-300 ">
      {displayMenu && (
        <Menu setDisplayMenu={setDisplayMenu}/>
      )}
      {isCreateNewChatMenu?(
        <div className=" h-full">
            
            <ChatCreate setCreateNewChatMenu={setCreateNewChatMenu}/>
        </div>
      ):(
        <div>
          
          <RoomsHeader setCreateNewChatMenu = {setCreateNewChatMenu} setDisplayMenu={setDisplayMenu}/>
          <ChatsSearch searchInputValue={searchInputValue} setSearchInputValue={setSearchInputValue}/>
          <ChatRoomsList searchInputValue={searchInputValue}/>
          
        </div>

      )}
    </div>
  )
}

export default ChatRoomsBlock