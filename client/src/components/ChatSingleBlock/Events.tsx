import React, { useEffect, useRef } from 'react';
import { MyForm } from './MyForm';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { extractDate, extractTime, formatDatePlate } from '../../contexts/GetTime';
import FileBubble from './FileBubble';
import { GiEvilComet } from 'react-icons/gi';
import SingleBubble from './SingleBubble';
import { useSocket } from '../../contexts/SocketContext';


interface EventItem {
  value: string;
  authorID: number;
  authorName: string;
  roomID: number;
  timestamp: string; // e.g. "2025-05-31 13:28:23"
}

interface EventsProps {
  events: EventItem[];
}

// function extractDate(dateTime: string): string {
//   return dateTime.split(" ")[0];
// }



// function extractTime(dateTime: string): string {
//   return dateTime.split(" ")[1].slice(0, 5);
// }

export function Events({ events }: EventsProps) {
  const {user, generateAndEncryptAESKey} = useAuth()
  const {chatRoomID} = useAppContext ()
  const bottomRef = useRef<HTMLDivElement>(null);
  const { sendEvent } = useSocket()
    
  // console.log(events)
  // console.log(events)
  useEffect(() => {
    generateAndEncryptAESKey(2);
  }, []);


  useEffect(() => {
    if (!chatRoomID || !user) return;
  
    const unreadFromOthers = events
      .filter(msg => 
        !msg.isRead && 
        msg.authorID !== user.id &&
        msg.roomID.toString() == chatRoomID
      )
      .map(msg => msg.id);
  
      // console.log("unreadFromOthers", unreadFromOthers)
    if (unreadFromOthers.length > 0) {
      sendEvent("read messages", { messageIDs: unreadFromOthers })
    }
  }, [events, chatRoomID, user]);
  
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    console.log(events)
  }, [events]);


  // 2) ALSO scroll to bottom whenever we switch to a different chatRoomID
  useEffect(() => {
    // Give React a moment to render the new room’s messages,
    // then scroll down. 
    // You can tweak ‘behavior’ to "auto" if you don’t want a smooth animation here.
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [chatRoomID]);

  return (
    // <div className="flex flex-col w-full h-full">
    <div className="flex flex-col w-full h-full">
      {/* scrolling */}
      <div className="flex-1  overflow-y-auto px-2 max-w-[600px] mx-auto w-full">
        <div className='h-4'></div>
        <ul className="list-none m-0 p-0 w-full flex flex-col justify-end">
          {
            events.map((event, index) =>{
              // Only show messages for the current room:
              if (event.roomID !== chatRoomID) return null;


              const isCurrentUser = event.authorID === user?.id;

              // Compute this event’s date string, e.g. "2025-05-31"
              const eventDate = extractDate(event.timestamp);

              // For the previous event (if exists), get its date:
              const prevDate =
              index > 0 && events[index - 1].roomID === chatRoomID
                ? extractDate(events[index - 1].timestamp)
                : null;

              // Decide if we need to render a date plate:
              const showDatePlate = eventDate !== prevDate;

              const isSameAuthorAsPrevious =
                index > 0 && 
                events[index - 1].authorID === event.authorID;

              

              return (
                <React.Fragment key={index}>
                  {/* Date Plate: centered, only when the date changes */}
                  {showDatePlate && (
                    <li className="flex justify-center mb-4">
                      <div className="bg-gray-300 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                        {formatDatePlate(eventDate)}
                      </div>
                    </li>
                  )}

                  {/* Message Bubble */}
                  <SingleBubble 
                    index = {index} 
                    isCurrentUser = {isCurrentUser}
                    isSameAuthorAsPrevious = {isSameAuthorAsPrevious}
                    event={event}  messageID = {event.id}
                  />
                </React.Fragment>
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