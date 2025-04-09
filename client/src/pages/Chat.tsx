
import ChatRoomsBlock from '../components/ChatRoomsBlock/ChatRoomsBlock';
import ChatSingleBlock from '../components/ChatSingleBlock/ChatSingleBlock';
import { useAppContext } from '../contexts/AppContext';




function Chat() {
  const {chatRoomID} = useAppContext ()        


  return (
    <div className="App m-0  h-screen w-screen flex">

      <ChatRoomsBlock />
      <ChatSingleBlock/>

    </div>
  )
}

export default Chat
