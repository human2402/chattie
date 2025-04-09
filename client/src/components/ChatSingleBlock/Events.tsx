import { useEffect, useRef } from 'react';
import { MyForm } from './MyForm';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';


interface EventsProps {
  events: any[]; // The events prop should be an array of strings inline-block
}

export function Events({ events }: EventsProps) {
  const {user} = useAuth()
  const {chatRoomID} = useAppContext ()
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    // <div className="flex flex-col w-full h-full">
    <div className="flex flex-col w-full h-full">
      {/* scrolling */}
      <div className="flex-1  overflow-y-auto px-2 max-w-[600px] mx-auto w-full">
        <ul className="list-none m-0 p-0 w-full flex flex-col">
          {
            events.map((event, index) =>
              (event.roomID.toString() == chatRoomID) && (
                
                (
                  event.authorID == user?.id ? (
                    <div className="flex w-full justify-end" key={ index }>
                      <li className="shadow-md  py-2 px-4 bg-blue-100 mx-4 mb-3  w-fit max-w-[75%] rounded-2xl" key={ index }>
                        { event.value }
                      </li>
                    </div>
                  ) : (
                    <div className="flex w-full justify-start" key={ index }>
                      <li className="shadow-md  py-2 px-4 bg-blue-100 mx-4 mb-2  w-fit max-w-[75%] rounded-2xl" key={ index }>
                        <p className='text-sm'>{event.authorName}</p>
                        { event.value }
                      </li>
                    </div>
                  )
                )
              )
              
            )
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