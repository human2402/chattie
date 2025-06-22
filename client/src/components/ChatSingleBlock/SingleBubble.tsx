import { BsThreeDots } from "react-icons/bs"
import { extractTime } from "../../contexts/GetTime"
import FileBubble from "./FileBubble"
import BubbleMenu from "./BubbleMenu"
import { useEffect, useRef, useState } from "react"

type Props = {
    index: number,
    isCurrentUser: boolean,
    isSameAuthorAsPrevious: boolean,
    event: {
        type: string,
        msg: string,
        timestamp: string,
        authorName: string,
        file: any,
        messageID: number
    }
}

const SingleBubble = ({
        index, isCurrentUser, 
        isSameAuthorAsPrevious,event, messageID
    }: Props) => {
        const [coords, setCoords] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
        const [menuOpen, setMenuOpen] = useState(false);
        const menuRef = useRef<HTMLDivElement | null>(null);
        const iconRef = useRef<HTMLButtonElement | null>(null);

    // useEffect (() => {
    //     console.log ("coords:", coords, "menuOpen:", menuOpen )
    // }, [coords, menuOpen])

    useEffect(() => {
        function handleClickOutside( e: MouseEvent) {
          if (
            menuRef.current &&
            !menuRef.current.contains(e.target as Node) &&
            !iconRef.current?.contains(e.target as  Node)
          ) {
            setMenuOpen(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
    

    useEffect(() => {
        if (menuOpen && iconRef.current) {
          const rect = iconRef.current.getBoundingClientRect();
          setCoords({
            top: rect.top + window.scrollY,
            left: isCurrentUser
              ? rect.left + window.scrollX - 140 // Menu appears to the left
              : rect.right + window.scrollX + 8 // Menu appears to the right
          });
        }
      }, [menuOpen, isCurrentUser]);

      function renderContent() {
        switch (event.type.trim()) {
          case "text":
            return event.msg;
          case "file":
            return <FileBubble file={event.file} />;
          case "deleted":
            return (
              <p className="italic text-gray-600">
                Сообщение удалено пользователем
              </p>
            )
          default:
            return null; // or some fallback UI
        }
      }


      const iconButton = (
        <button
          ref={iconRef}
          className="relative hidden group-hover:block text-gray-400 hover:text-gray-600"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <BsThreeDots className="w-5 h-5" />
        </button>
      );

  return (
    <div 
        key={index}
        className={`
            relative group
            flex w-full 
            ${isCurrentUser?"justify-end":"justify-start"}
        `} 
    >
        {isCurrentUser&& iconButton}

        <li 
            className={`
                
                shadow-md py-2 px-4 
                ${isCurrentUser?"bg-blue-100":"bg-white"} mx-4 mb-3 
                w-fit max-w-[75%] rounded-2xl
            `} 
        >
            {(!isSameAuthorAsPrevious&&!isCurrentUser)&&(
                <p className='text-sm text-blue-500 font-semibold'>
                    {event.authorName}
                </p>
            )}
            <p className='break-words whitespace-pre-wrap'>
              {renderContent ()}
            </p>
            <p className='text-right font-light text-sm text-gray-500'>
                {extractTime( event.timestamp)}
            </p>

            
        </li>

        {!isCurrentUser&&iconButton}

        {menuOpen && (
            <BubbleMenu 
                coords={coords}
                ref={menuRef}
                setMenuOpen={setMenuOpen}
                index={index}
                messageID = {messageID}
            />
        )}
        
    </div>
  )
}

export default SingleBubble