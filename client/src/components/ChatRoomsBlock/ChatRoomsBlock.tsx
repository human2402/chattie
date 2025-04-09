import ChatRoomsList from "./ChatRoomsList"
import CreateChat from "./CreateChat"



function ChatRoomsBlock() {
  return (
    <div
        className="min-w-90"
    >
      <CreateChat  />
      <ChatRoomsList />
    </div>
  )
}

export default ChatRoomsBlock