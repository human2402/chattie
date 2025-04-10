import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { socket } from '../../socket.ts';
import { useNavigate } from 'react-router';

type Props = {}

type Chat = {
    id: number;
    display_name: string;
    // Include other necessary properties here if needed
  };

function ChatRoomsList({}: Props) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    const {chatRoomID ,setChatRoomID, setChatRoomData} = useAppContext ();
    
    const {user} = useAuth()

    const navigate = useNavigate();
    
    function onChangeChat ( newRoomID:number, chat: any[]) {
        socket.timeout(5000).emit('join room', newRoomID, (err: any) => {
            if (err) {
            console.log('Error joining room, retrying...');
            // Retry logic can be implemented here if necessary
            }
            setChatRoomID (newRoomID)
            setChatRoomData (chat)
        });
    }

    useEffect(() => {
        const fetchChats = async () => {
            

            try {
                const response = await fetch("/api/users/rooms/"+user.id, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                });
        
                if (!response.ok) {
                    if(response.status == 400) {
                        navigate('/login')
                    }
                    throw new Error("Failed to fetch loaners");
                }
        
                const data: Chat[] = await response.json();
                setChats(data);
                console.log(data)
            } catch (error) {
                setError("Failed to load Chats. Please try again.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchChats();
            
    }, []);
    
    
    return (
        <div>
            {
                chats.map ((chat, index) => (
                    <div 
                        className={'hover:bg-gray-200 py-2 px-2 mx-2 transition-colors rounded-[8px] '+(chat.id.toString()==chatRoomID&&"bg-blue-100")}
                        key={index} 
                        onClick={() => onChangeChat(chat.id, chat)}
                    >
                        <p>{chat.display_name}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default ChatRoomsList