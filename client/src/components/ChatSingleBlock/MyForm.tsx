import { useState, FormEvent, useEffect, useRef  } from 'react';
import { getSocket } from '../../socket.ts';
import { useAppContext } from '../../contexts/AppContext.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';
import getTimestamp from '../../contexts/GetTime.ts';
import { IoSend } from "react-icons/io5";
import { CgAttachment } from "react-icons/cg";
import { useSocket } from '../../contexts/SocketContext.tsx';
import { BsEmojiSmile } from "react-icons/bs";
import { sendFile } from '../../contexts/FetchigCool.ts';

import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import ru from '../../types/ruEmojies.ts';




let counter = 0; 

export function MyForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  
  useClickOutside(pickerRef, () => setShowEmojiPicker(false));

  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {user} = useAuth()
  const {chatRoomID, messageEditMode, setMessageEditMode} = useAppContext ()
  const {socket} = useSocket();
  // console.log(user) 

  function useClickOutside(ref, onClickOutside) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          onClickOutside();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, onClickOutside]);
  }

  useEffect (() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto"; // reset to auto so scrollHeight recalculates
    ta.style.height = ta.scrollHeight + "px";
  }, [value]);


  useEffect (() => {
    if (messageEditMode.editedMessageID){
      setValue(messageEditMode.msg)
    }
  }, [messageEditMode])


  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const authorName = `${user?.firstName} ${user?.lastName}`
    const timestamp = getTimestamp() 


    if (!socket) {
      console.warn("Socket not ready yet");
      return;
    }

    if (value.trim()!='' && chatRoomID!= null && user?.firstName != undefined) {

      const clientOffset = `${socket.id}-${counter++}`; 
  
      if (!messageEditMode.editedMessageID){
        socket.timeout(5000).emit(`chat message`, {
          msg: value.trim(), 
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
      } else {
        socket.timeout(5000).emit(`edit message`, {
          msg: value.trim(), 
          messageID: messageEditMode.editedMessageID,
          timestamp: timestamp, 
          clientOffset: clientOffset,
        }, (err: any) => {
        if (err) {
          console.log('Error sending message, retrying...');
          // Логика при ошибке
        }
          setIsLoading(false);
        });
      }
      
    } else {console.error ("Ошибка отправки")}

    setValue("")
    setMessageEditMode({
      editedMessageID: 0,
      msg: ''
    })
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
    sendFile(
      file, chatRoomID, user?.id, 
      socket, authorName, timestamp, 
      clientOffset
    );
  }

  return (
      <div className="sticky bottom-0 px-2 pb-2 ">
        
        <input
          type="file"
          accept="*/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <form
          onSubmit={onSubmit}
          className="w-full max-w-[600px] mx-auto bg-white rounded-xl custom-double-shadow"
        >

          {(messageEditMode.editedMessageID)?(<p className='px-3 pt-2 text-blue-600'>Редактирование сообщения:</p>):null}

          <div className='flex items-center '>
            <CgAttachment 
              className="m-2 text-gray-500 h-6 w-6 flex-shrink-0 cursor-pointer" 
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
              onClick={() => setShowEmojiPicker(prev => !prev)}
            />

            <BsEmojiSmile 
              className="m-2 text-gray-500 h-6 w-6 flex-shrink-0" 
              onClick={() => setShowEmojiPicker(prev => !prev)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="m-2 p-[6px] text-[#2ba6ff] rounded-xl flex-shrink-0"
            >
              <IoSend className="h-6 w-6" />
            </button>
            {showEmojiPicker && (
              <div ref={pickerRef} className="absolute bottom-16 right-2 z-50">
                <Picker 
                  onEmojiSelect={(emoji) => setValue(prev => prev + emoji.native)} 
                  data={data} 
                  theme="light"
                  locale="ru"
                  i18n={ru}
                />
              </div>
            )}

          </div>
          
        </form>
      </div>
  );

}

