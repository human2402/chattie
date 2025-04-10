import { useState } from "react"
import ChatRoomsList from "./ChatRoomsList"
import CreateChat from "./CreateChat"
import RoomsHeader from "./RoomsHeader"
import ChatCreate from "./ChatCreate"



function ChatRoomsBlock() {
  const [isCreateNewChatMenu, setCreateNewChatMenu] = useState<boolean> (false)  

  return (
    <div className="min-w-90 h-full border-r-[1px] border-gray-300 ">
      {isCreateNewChatMenu?(
        <div className=" h-full">
            <ChatCreate setCreateNewChatMenu={setCreateNewChatMenu}/>
        </div>
      ):(
        <div>
          <RoomsHeader setCreateNewChatMenu = {setCreateNewChatMenu}/>
          <CreateChat  />
          <ChatRoomsList />
          
        </div>

      )}
    </div>
  )
}

export default ChatRoomsBlock