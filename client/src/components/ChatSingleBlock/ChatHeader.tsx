import React from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { useSocket } from '../../contexts/SocketContext';
import { ConnectionManager } from "../ChatRoomsBlock/ConnectionManager";
import { IoClose } from 'react-icons/io5';

type Props = {}

const emptyChatRoomData = {
    id : 0,
    name :  '' ,
    description : null,
    created_by : 0,
    created_at :  "" ,
    is_private : 0,
    amount_of_participants : 0,
    display_name :  "" 
}

function ChatHeader({}: Props) {
    const {chatRoomData, chatRoomID, setChatRoomID, setChatRoomData, setChatDetails} = useAppContext();
    


    return (
        <div className='flex py-1 items-center min-h-[47px]'>
            <div className='grow flex flex-col justify-center '>
                <p className='text-[17px] font-semibold'>
                    {chatRoomData.display_name}
                </p>
                {(!chatRoomData.is_private&& chatRoomData.amount_of_participants>0)?(
                    <p 
                        className='text-gray-500 font-light'
                        onClick={() => setChatDetails(chatRoomData.id)}
                    >
                        {chatRoomData.amount_of_participants} участнов
                    </p>
                ):(
                    <p className='text-gray-500 font-light'>
                        Онлайн
                    </p>
                )}  

            </div>
            <IoClose
                className='h-6 w-6 text-gray-500 hover:text-black transition'
                onClick={() =>{
                    setChatRoomID(null)
                    setChatRoomData(emptyChatRoomData)
                }}
            />
        </div>
    )
}

export default ChatHeader