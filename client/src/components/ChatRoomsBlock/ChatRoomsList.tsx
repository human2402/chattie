import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { useSocket } from '../../contexts/SocketContext.tsx';

import { useNavigate } from 'react-router';
import { abbreviateName } from '../../contexts/FetchigCool.ts';
import UserIcon from '../UserIcon.tsx';

type Props = {}

type Chat = {
    searchInputValue: string
    // Include other necessary properties here if needed
  };

function ChatRoomsList({searchInputValue}: Props) {
    const {chats, setChats} = useAppContext()
    // const [chats, setChats] = useState<Chat[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    
    const {chatRoomID ,setChatRoomID, setChatRoomData} = useAppContext ();
    
    const {notifyEvents,setNotifyEvents} = useSocket()

    const {user} = useAuth()

    const navigate = useNavigate();

    const UserIconClassName = "mr-2 text-blue-500 py-[px]"
    
    // const socket = getSocket()

    // function onChangeChat ( newRoomID:number, chat: any[]) {
    //     socket.timeout(5000).emit('join room', newRoomID, (err: any) => {
    //         if (err) {
    //         console.log('Error joining room, retrying...');
    //         // Retry logic can be implemented here if necessary
    //         }
    //         setChatRoomID (newRoomID)
    //         setChatRoomData (chat)
    //     });
    // }

    const { socket } = useSocket();

    function onChangeChat ( newRoomID:number, chat: any[]) {
        if (!socket) {
            console.warn("Socket not ready yet");
            return;
        }

        socket
        .timeout(5000)
        .emit("join room", newRoomID, true, (err: any) => {
          if (err) {
            console.error("Error joining room:", err);
            // you can retry here if you want
            return;
          }
          setChatRoomID(newRoomID);
          setChatRoomData(chat);
        });
    }

    // console.log(notifyEvents)
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
                // console.log(data)
            } catch (error) {
                setError("Failed to load Chats. Please try again.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchChats();
            
    }, []);
    
    if (searchInputValue) {
        return (
            <div>
            {
                chats.map ((chat, index) => {
                    if(chat.display_name.includes(searchInputValue)){
                        return (
                            <div 
                                className={'hover:bg-gray-200 cursor-pointer py-2 px-2 mx-2 transition-colors rounded-[8px] '+(chat.id.toString()==chatRoomID&&"bg-blue-100")}
                                key={index} 
                                onClick={() => onChangeChat(chat.id, chat)}
                            >
                                <p>{chat.display_name}</p>
                            </div>
                        )
                    }})
            }
            </div>
        )
    }
    return (
        <div>
            {
                chats.map ((chat, index) => {
                    // console.log(chat)
                    const notifications = notifyEvents.filter(
                        (event) => Number(event.roomID) === Number(chat.id)
                    );
                    const latestNotification =
                        notifications.length > 0 ? notifications[0] : null;
                    const unreadCount  = notifications.length;
                    return (<div 
                        className={'flex items-center cursor-pointer hover:bg-gray-200 py-2 px-2 mx-2 transition-colors rounded-[8px] '+(chat.id.toString()==chatRoomID&&"bg-blue-100")}
                        key={index} 
                        onClick={() => {
                            onChangeChat(chat.id, chat)
                            if (latestNotification) {
                                setNotifyEvents((prev) => prev.filter(
                                    (event) => Number(event.roomID) != Number(chat.id)
                                ))
                            }
                        }}
                    >
            
                        <UserIcon isPrivate = {chat.is_private} />
                        <div className='pl-1 grow'>
                            <p className='font-semibold'>{chat.display_name}</p>
                            <p className='text-gray-600'>
                                {
                                    latestNotification && 
                                    (
                                        !chat.is_private ? 
                                        abbreviateName(latestNotification.authorName) +": " + 
                                        latestNotification.value:
                                        latestNotification.value
                                    )
                                }
                            </p>
                        </div>
                        {unreadCount>0&&
                            (
                                <p className='bg-[#2688EB] text-white py-0 px-3 rounded-full text-sm'>
                                    {unreadCount}
                                </p>

                            )
                        }
                    </div>)
                })
            }
        </div>
    )
}

export default ChatRoomsList