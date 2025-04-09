import React, { createContext, useContext, useState, ReactNode } from 'react';


type AppContextType = {
    chatRoomID: string | null
    setChatRoomID: React.Dispatch<React.SetStateAction<string | null>>
}

const AppContext = createContext<AppContextType>({} as AppContextType)

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [chatRoomID, setChatRoomID] = useState <string | null> (null)

    return(
        <AppContext.Provider value={{ chatRoomID, setChatRoomID }}>
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