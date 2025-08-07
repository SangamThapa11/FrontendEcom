import { useEffect } from "react";
import { useUserLayout } from "../../context/UserLayoutContext";
import UserListSidePanel from "../../components/chat/UserListSidePanel";
import ChatMessageBox from "../../components/chat/ChatMessagebox";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../config/store.config";
import { getAllUserList } from "../../reducer/User.reducer";
import socket from "../../config/socket.config";



const ChatListPage = () => {
    const { setLayoutContent } = useUserLayout();
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        setLayoutContent({ showSidebar: false, contentFullWidth: true })
    }, [])
    // reducer tigger
    useEffect(() => {
        setLayoutContent({showSidebar: false, contentFullWidth: true})
        dispatch(getAllUserList({page: 1, limit: 50, search: null}))
        socket.connect()
    }, [])
    return (
        <>
            <div className="flex w-full gap-12 h-full">
                <UserListSidePanel/>
                <ChatMessageBox/>
                
            </div>
        </>
    );
}
export default ChatListPage; 