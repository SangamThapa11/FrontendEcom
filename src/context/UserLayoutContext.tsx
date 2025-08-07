import React, { createContext, useContext, useState, type Dispatch, type SetStateAction } from "react";

interface IUserLayoutProviderProps {
    children: React.ReactNode
}
interface IUserLayoutValueType{
    showSidebar: boolean,
    contentFullWidth: boolean
}
interface IUserContextType{
    showSidebar: boolean;
    contentFullWidth: boolean;
    setLayoutContent: Dispatch<SetStateAction<IUserLayoutValueType>>
}
export const UserLayoutContext = createContext<IUserContextType> ({
    showSidebar: true,
    contentFullWidth: false,
    setLayoutContent: () => {}
})

export const UserLayoutProvider = ({ children }: IUserLayoutProviderProps) => {
    const [layoutContent, setLayoutContent] = useState<IUserLayoutValueType>({
        showSidebar: true,
        contentFullWidth: false
    });
    return (
        <UserLayoutContext.Provider
            value={{
                showSidebar: layoutContent.showSidebar,
                contentFullWidth: layoutContent.contentFullWidth,
                setLayoutContent
            }}
        >
            {children}
        </UserLayoutContext.Provider>
    );
};

export const useUserLayout = () => {
    const {showSidebar, contentFullWidth, setLayoutContent} = useContext(UserLayoutContext)
    return {
        showSidebar,
        contentFullWidth,
        setLayoutContent
    }; 
}