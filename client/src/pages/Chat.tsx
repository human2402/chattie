import { useState } from 'react';
import ChatRoomsBlock from '../components/ChatRoomsBlock/ChatRoomsBlock';
import ChatSingleBlock from '../components/ChatSingleBlock/ChatSingleBlock';




function Chat() {
  const [currentChatID, setCurrentChatID]= useState("hi")
  return (
    <div className="App m-0 pb-3 h-screen w-screen flex">
      <p>{currentChatID}</p>
      <ChatRoomsBlock />
      <ChatSingleBlock/>

    </div>
  )
}

export default Chat
