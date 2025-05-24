import { useEffect, useRef } from 'react';
import { MyForm } from './MyForm';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { extractDate, extractTime } from '../../contexts/GetTime';


interface EventsProps {
  events: any[]; // The events prop should be an array of strings inline-block
}

export function Events({ events }: EventsProps) {
  const {user, generateAndEncryptAESKey} = useAuth()
  const {chatRoomID} = useAppContext ()
  const bottomRef = useRef<HTMLDivElement>(null);
    
  // console.log(events)

  useEffect(() => {
    generateAndEncryptAESKey(2);
  }, []);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    // <div className="flex flex-col w-full h-full">
    <div className="flex flex-col w-full h-full">
      {/* scrolling */}
      <div className="flex-1  overflow-y-auto px-2 max-w-[600px] mx-auto w-full">
        <div className='h-4'></div>
        <ul className="list-none m-0 p-0 w-full flex flex-col justify-end">
          {
            events.map((event, index) =>{
              const isCurrentUser = event.authorID === user?.id;
              const isSameAuthorAsPrevious =
                index > 0 && events[index - 1].authorID === event.authorID;

              if (event.roomID !== chatRoomID) return null;

              return isCurrentUser ? (
                  <div className="flex w-full justify-end" key={ index }>
                    <li className="shadow-md  py-2 px-4 bg-blue-100 mx-4 mb-3  w-fit max-w-[75%] rounded-2xl" key={ index }>
                      <p>{ event.value }</p>
                      <p className='text-right font-light text-sm text-gray-500'>
                        {extractTime( event.timestamp)}
                      </p>
                    </li>
                  </div>
                ) : (
                  <div className="flex w-full justify-start" key={ index }>
                    <li className="shadow-md  py-2 px-4 bg-white mx-4 mb-2  w-fit max-w-[75%] rounded-2xl" key={ index }>
                      {!isSameAuthorAsPrevious&&(
                        <p className='text-sm text-blue-500 font-semibold'>{event.authorName}</p>
                      )}
                      <p>{ event.value }</p>
                      <p className='text-right font-light text-sm text-gray-500'>
                        {extractTime( event.timestamp)}
                      </p>
                    </li>
                  </div>
                )
              
            })
          }
          <div ref={bottomRef} />
        </ul>
      </div>
      <div className="px-2 max-w-[600px] mx-auto w-full">
        <MyForm />
      </div>
    </div>
  );
}