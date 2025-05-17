
import { useEffect } from 'react';
import ChatRoomsBlock from '../components/ChatRoomsBlock/AChatRoomsBlock';
import ChatSingleBlock from '../components/ChatSingleBlock/AChatSingleBlock';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';




function Chat() {
  const {chatRoomID} = useAppContext ()        
  const {user} = useAuth ()
  const nav = useNavigate()

  useEffect(() => {
    if (!user) {
      nav('/login')
    }
  }, [user])

  return (
    <div className="App m-0  h-screen w-screen flex">

      <ChatRoomsBlock />
      <ChatSingleBlock/>

    </div>
  )
}

export default Chat
