import React from 'react'

function Example() {
  return (
    <div>
      {chats
        .filter(chat =>
            chat.name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .map(chat => (
            <div key={chat.id} className="chat-item">
            {chat.isPrivate ? <UserIcon /> : <GroupIcon />}
            <span>{chat.name}</span>
            </div>
        ))}

    </div>
  )
}

export default Example
