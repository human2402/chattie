import { useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { useAuth } from '../../contexts/AuthContext';

import {fetchGetCool, fetchPostCool} from '../../contexts/FetchigCool';
import UserSelector from './UserSelector';
import getTimestamp from '../../contexts/GetTime';

type Props = {
    setCreateNewChatMenu: (value: boolean) => void
  }

function ChatCreate({setCreateNewChatMenu}: Props) {
    const [nameValue, setNameValue] = useState('');
    const [users, setUsers] = useState ([])
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedUserIDs, setSelectedUserIDs] = useState<number[]>([]);

    const {user, chatRoomData} = useAuth()

    useEffect(() => {
            const url = "/api/users/"+user?.id
            fetchGetCool(url, setUsers, setError, setIsLoading);
        }, []);

    const handleCreate = async ()  => {
        console.log(nameValue, selectedUserIDs)
        const isPrivate = !(selectedUserIDs.length>1)
        const newData = {
            participants: [...selectedUserIDs, user?.id],
            name: isPrivate?"Приватная беседа":nameValue,
            created_by: user?.id,
            created_at: getTimestamp(),
            amount_of_participants: selectedUserIDs.length+1,
            is_private: isPrivate
        }

        const res = fetchPostCool(newData, "/api/rooms", setError, setIsLoading)
        setNameValue("")
    } 

    return (
        <div className='flex flex-col h-full'>

            <div className='flex items-center mx-3 h-12'>
                <p className='font-semibold grow text-md'>Создание чата</p>
                <IoClose 
                    className='h-6 w-6 text-gray-500 hover:text-black transition'
                    onClick={() => setCreateNewChatMenu(false)}
                />
            </div>
            
            <div className='grow min-h-0'>
                <UserSelector users={users} selectedUserIDs = {selectedUserIDs} setSelectedUserIDs ={setSelectedUserIDs}/>
            </div>
            
            <div className='flex border-t-[1px] border-gray-300 '>
                {selectedUserIDs.length > 1&&(

                    <input 
                        placeholder='Введите название чата'
                        className={`px-4 py-2 bg-gray-100 my-2
                            grow rounded-xl m-2 ml-2 focus:outline-0 focus:border-blue-500 border-[1px] border-gray-300` }
                        onChange={ e => setNameValue(e.target.value) } 
                        value={ nameValue }
                    />
                )} 
            </div>
            <div className='flex justify-end mt-2 mb-1'>
                <button 
                    className='bg-blue-500  text-white px-3 rounded-xl mb-2 mx-2 py-2 hover:to-blue-800'
                    type="submit"   
                    disabled={ isLoading }
                    onClick={() => handleCreate()}
                >
                    Создать
                </button>
            </div>
        </div>
    )
}



export default ChatCreate