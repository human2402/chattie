import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../contexts/AppContext';
import { fetchGetCool } from '../../contexts/FetchigCool';
import UserIcon from '../UserIcon';
import { IoClose } from 'react-icons/io5';

type Props = {}

interface ParticipantsResponse {
    participants: Array<{
      id: number;
      friendly_name: string;
      // …any other fields…
    }>;
  }

function ChatDetails({}: Props) {
    const { chatDetails, setChatDetails } = useAppContext() ;
    const [fetchedDeets, setFetchedDeets] = useState<ParticipantsResponse>({
        participants: [],
      });
    const [error, setError] = useState <boolean> (true)
    const [loading, setLoading] = useState <boolean> (true)

    useEffect(() => {
        fetchGetCool("/api/rooms/"+chatDetails+"/participants",setFetchedDeets,setError, setLoading)
    }, []);

    useEffect(() => {
        console.log(fetchedDeets.participants)
    }, [fetchedDeets]);

    if (loading) return (<p>Loading</p>)
    return (
        <div
            className="fixed inset-0 bg-black/20 z-50 flex justify-center items-center p-4"
            onClick={() => setChatDetails(0)}
        >

            <div
                className="bg-white rounded-lg shadow-lg w-64 p-1"
            >
                <div className='flex items-center py-3 px-2 '>
                    <p className='grow '>
                        Участники чата #{chatDetails}:
                    </p>
                    <IoClose 
                        className='h-6 w-6 text-gray-500 hover:text-black transition'
                        onClick={() => setChatDetails(0)}
                    />
                </div>
                <div className='h-[1px] bg-gray-300'></div>
                

                <div className='py-1'>
                    {fetchedDeets?.participants.map((item, index) => (
                        <div className='flex py-3 items-center px-2'>
                            <UserIcon isPrivate = {true} />
                            <p className='font-semibold pl-1'>{item.friendly_name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ChatDetails