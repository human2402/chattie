import React from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { useSocket } from '../../contexts/SocketContext';
import { ConnectionManager } from "./ConnectionManager";
import ConnectionState from "./ConnectionState";

type Props = {}

function ChatRoomHeader({}: Props) {
    const {chatRoomData} = useAppContext();
    const { isConnected } = useSocket();


    return (
        <div className='flex h-12 '>
            <div className='grow flex flex-col justify-center'>
                <p className='text-[17px] font-semibold'>
                    {chatRoomData.display_name}
                </p>
                {(!chatRoomData.is_private&& chatRoomData.amount_of_participants>0)&&(
                    <p className='text-gray-500 font-light'>
                        {chatRoomData.amount_of_participants} участнов
                    </p>
                )}  

            </div>
            <ConnectionManager />
            <ConnectionState isConnected={isConnected} />
        </div>
    )
}

export default ChatRoomHeader