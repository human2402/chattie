import { useState, FormEvent, useEffect, useRef  } from 'react';
import { getSocket } from '../../socket.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import getTimestamp from '../../contexts/GetTime.ts';
import { IoSend } from "react-icons/io5";
import { CgAttachment } from "react-icons/cg";
import { useSocket } from '../../contexts/SocketContext.tsx';
import { BsEmojiSmile } from "react-icons/bs";
import { sendImage } from '../../contexts/FetchigCool.ts';

let counter = 0; 

export function MyForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {user} = useAuth()
  const {chatRoomID} = useAppContext ()
  const {socket} = useSocket();
  // console.log(user) 

  useEffect (() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto"; // reset to auto so scrollHeight recalculates
    ta.style.height = ta.scrollHeight + "px";
  }, [value]);


  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const authorName = `${user?.firstName} ${user?.lastName}`
    const timestamp = getTimestamp() 


    if (!socket) {
      console.warn("Socket not ready yet");
      return;
    }

    if (value!='' && chatRoomID!= null && user?.firstName != undefined) {

      const clientOffset = `${socket.id}-${counter++}`; 
  
      socket.timeout(5000).emit(`chat message`, {
          msg: value, 
          roomID: chatRoomID, 
          authorID: user.id, 
          authorName: authorName, 
          timestamp: timestamp, 
          clientOffset: clientOffset,
          type: "text"
        }, (err: any) => {
        if (err) {
          console.log('Error sending message, retrying...');
          // Логика при ошибке
        }
        setIsLoading(false);
      });
    } else {console.error ("Ошибка отправки")}

    setValue("")
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // Manually trigger form submission
      const form = e.currentTarget.form;
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const authorName = `${user?.firstName} ${user?.lastName}`
    const timestamp = getTimestamp() 
    const clientOffset = `${socket.id}-${counter++}`; 

    // You can send the file here or preview it first
    sendImage(
      file, chatRoomID, user?.id, 
      socket, authorName, timestamp, 
      clientOffset
    );
  }

  return (
      <div className="sticky bottom-0 px-2 pb-2 ">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <form
          onSubmit={onSubmit}
          className="flex items-center w-full max-w-[600px] mx-auto bg-white rounded-xl custom-double-shadow"
        >
          <CgAttachment 
            className="m-2 text-gray-500 h-6 w-6 flex-shrink-0" 
            onClick={() => fileInputRef.current?.click()}
          />

          {/* Auto-growing Textarea, bottom-aligned */}
          <textarea
            ref={textareaRef}
            rows={1}
            onKeyDown={onKeyDown}
            className="resize-none overflow-y-auto grow mx-2 focus:outline-none text-baserounded-md max-h-[8rem]"
            placeholder="Начните набирать сообщение..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <BsEmojiSmile className="m-2 text-gray-500 h-6 w-6 flex-shrink-0" />

          <button
            type="submit"
            disabled={isLoading}
            className="m-2 p-[6px] text-[#2ba6ff] rounded-xl flex-shrink-0"
          >
            <IoSend className="h-6 w-6" />
          </button>
        </form>
      </div>
  );

}

