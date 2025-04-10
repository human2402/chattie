
import ChatRoomsBlock from '../components/ChatRoomsBlock/AChatRoomsBlock';
import ChatSingleBlock from '../components/ChatSingleBlock/AChatSingleBlock';
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
