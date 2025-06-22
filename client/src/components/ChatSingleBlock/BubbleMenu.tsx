import React, { forwardRef } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  coords: { top: number; left: number };
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  messageID: number,
  msg: string
};



const BubbleMenu = forwardRef<HTMLDivElement, Props>(({ coords, setMenuOpen, index, messageID, msg }, ref) => {
    const {sendEvent} = useSocket()
    const {messageEditMode, setMessageEditMode} = useAppContext()

    const handleDelete = () => {
        sendEvent("delete message", { messageID }, () => {
            console.log("Message deleted!");
          });
    }

    const handleEdit = () => {
      setMessageEditMode({
        editedMessageID: messageID,
        msg: msg
      })
    }
  
  
    return (
    <div
      ref={ref}
      className="z-50 w-35 bg-white rounded-md shadow-lg" 
      style={{
        top: coords.top,
        left: coords.left,
        position: 'fixed'
      }}
    >
      <button
        onClick={() => {
          setMenuOpen(false);
          handleEdit()
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Редактировать
      </button>
      <button
        onClick={() => {
          setMenuOpen(false);
          handleDelete()
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Удалить
      </button>
    </div>
  );
});

export default BubbleMenu;
