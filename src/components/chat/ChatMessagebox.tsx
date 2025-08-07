import { useEffect, useRef } from "react";
import TopUserDetail from "./TopUserDetail";
import { useSelector } from "react-redux";
import type { RootState } from "../../config/store.config";
import type { UserProfile } from "../../context/AuthContext";
import { MessageDetail } from "./MessageDetail";
import SendMessageBox from "./SendMessageBox";


const ChatMessageBox = () => {

    const divRef = useRef<HTMLDivElement | null>(null)
    useEffect(()=> {
        if(divRef.current) {
            divRef.current.scrollIntoView({behavior:"smooth"})
        }
    }, [])
    const activeUser =useSelector((rootState: RootState) => {
        return rootState?.user?.activeUser as unknown as UserProfile
    })
    return (<>
    <div className="w-4/5">
                    <div className="flex flex-col h-full bg-white rounded-lg shadow p-6">
                        {/* User Profile */}
                        {activeUser ? (
                            <>
                            <TopUserDetail />
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                            {/* Example messages */}
                            <MessageDetail />
                            <div ref={divRef}></div>
                        </div>
                        {/* Send Message Box */}
                        <SendMessageBox />
                            </>
                            ) : ( 
                            <>
                            <div className="w-full h-full flex text-center items-center justify-center">
                                Please select some user ......
                            </div>
                            </>)
                        }
                    </div>
                </div>
    </>)
}
export default ChatMessageBox; 