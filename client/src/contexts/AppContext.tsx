import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


export type AppContextType = {
    chatRoomID: string | null;
    setChatRoomID: React.Dispatch<React.SetStateAction<string | null>>;
    chatRoomData: chatRoomDataType;
    setChatRoomData: React.Dispatch<React.SetStateAction<chatRoomDataType>>;
    isCreateNewChatMenu: boolean;
    setCreateNewChatMenu: React.Dispatch<React.SetStateAction<boolean>>;
    chatDetails: number;
    setCreatesetChatDetailsNewChatMenu: React.Dispatch<React.SetStateAction<number>>;
  };

type chatRoomDataType = {
     id : number,
     name :  string ,
     description : string | null,
     created_by : number,
     created_at :  string ,
     is_private : number,
     amount_of_participants : number,
     display_name :  string 
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isCreateNewChatMenu, setCreateNewChatMenu] = useState<boolean> (false) 
    const [chatDetails, setChatDetails] = useState <number> (0) 
    const [chatRoomID, setChatRoomID] = useState <string | null> (null)
    const [chatRoomData, setChatRoomData] = useState <chatRoomDataType> ({
        id : 0,
        name :  '' ,
        description : null,
        created_by : 0,
        created_at :  "" ,
        is_private : 0,
        amount_of_participants : 0,
        display_name :  "" 
    })
    const [messageEditMode, setMessageEditMode] = useState({
        editedMessageID: 0,
        msg: ''
    })

    useEffect(() => {
        console.log("chats", chats)
    }, [chats])

    return(
        <AppContext.Provider value={{ 
            chatRoomID, setChatRoomID, 
            chatRoomData, setChatRoomData,
            isCreateNewChatMenu, setCreateNewChatMenu,
            chats, setChats,
            chatDetails, setChatDetails,
            messageEditMode, setMessageEditMode
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};