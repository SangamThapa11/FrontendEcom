import { useSelector } from "react-redux"
import type { RootState } from "../../config/store.config"
import { useAuth, type UserProfile } from "../../context/AuthContext"
import { useState } from "react"
import chatService from "../../services/chat.service"
import socket from "../../config/socket.config"

const SendMessageBox = () => {
    const {loggedInUser} = useAuth()
    const selectedUser = useSelector((rootState: RootState) => {
        return rootState?.user?.activeUser as unknown as UserProfile
    })
    const [message, setMessage] = useState<string|null>(null)
    
    const sendMessage = async () => {
        try {
            const payload = {
                receiver: selectedUser._id,
                message: message
            } as{receiver: string, message: string}
            await chatService.sendMessage(payload)
            // notify server 
            socket.emit("newMessageSent", {sender: loggedInUser?._id, receiver: selectedUser._id})
            setMessage("")
        }catch {
            //
        }
    }
    return (<>
    <div className="border-t pt-4">
                            <div className="flex items-center gap-2">
                                <input 
                                type="text"
                                onChange={(e) => {
                                    setMessage(e.target.value)
                                }}
                                value={message as string}
                                placeholder="Type your message here..."
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
                                />
                                <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-lg transition hover:scale-97"
                                onClick={()=> {sendMessage()}}>Send</button>
                            </div>

                        </div>
    </>)
}
export default SendMessageBox