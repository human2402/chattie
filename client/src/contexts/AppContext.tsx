import React, { createContext, useContext, useState, ReactNode } from 'react';


type AppContextType = {
    chatRoomID: string | null
    setChatRoomID: React.Dispatch<React.SetStateAction<string | null>>
}

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

    return(
        <AppContext.Provider value={{ chatRoomID, setChatRoomID, chatRoomData, setChatRoomData }}>
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