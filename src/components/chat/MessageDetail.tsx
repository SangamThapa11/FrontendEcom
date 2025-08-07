import React, { useEffect, useState } from "react"
import { useAuth, type UserProfile } from "../../context/AuthContext"
import { useSelector } from "react-redux"
import type { RootState } from "../../config/store.config"
import { convertToHumanTime } from "../../utilities/helpers"
import chatService from "../../services/chat.service"
import type { AxiosSuccessResponse } from "../../config/axios.config"
import socket from "../../config/socket.config"

export interface IMessageDetail {
    _id: string,
    sender: UserProfile,
    receiver: UserProfile,
    message: string,
    createdAt: Date | string,
    updatedAt: Date | string,
    _v: number
}

export const MessageDetail = () => {
    const [messages, setMessages] = useState<Array<IMessageDetail>>();
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 0,
        total: 0
    });
    const {loggedInUser} = useAuth()
    const activeUser = useSelector((rootState: RootState) => {
        return rootState?.user?.activeUser as unknown as UserProfile
    })

    const getMessageDetailList = async() => {
        
        try {
           const response = await chatService.detailChatMessage(activeUser._id, {
            page: 1,
            limit: 100,
            search: null
        }) as unknown as AxiosSuccessResponse
        setMessages(response.data.reverse())
        setPagination({
            ...pagination,
            ...response.options.pagination 
        })
        }catch {
            //
        }
    }

    useEffect(() => {
        getMessageDetailList()
    }, [activeUser])

    useEffect(() => {
        //getMessageDetailList()
        const handleMessageReceivedEvent = async () => {
            await getMessageDetailList()
        }
        const handleSelfMessageReceivedEvent = async () => {
            await getMessageDetailList()
        }
        //socket handle
        socket.on("messageReceived", handleMessageReceivedEvent);
        socket.on("selfMessageReceived", handleSelfMessageReceivedEvent);
        return () => {
            socket.off("messageReceived", handleMessageReceivedEvent);
            socket.off("selfMessageReceived", handleSelfMessageReceivedEvent);
        }
    }, [])
    return(<>
    {
        messages && messages.map((message: IMessageDetail) => (
            <React.Fragment key={message._id}>
            {
                message.receiver._id === loggedInUser?._id ? ( <>
                <div className="flex items-start gap-3">
                                <img 
                                src={activeUser.image}
                                 alt="User Avatar" 
                                className="w-8 h-8 rounded-full object-cover"/>
                                <div>
                                <div className="bg-gray-100 text-white  px-4 py-2 rounded-lg rounded-tl-none max-w-xs h-14 bg-linear-to-t from-sky-500 to-indigo-500">
                                    {message.message}
                                </div>
                                <span className="text-xs text-gray-400 ml-1">{convertToHumanTime(message.createdAt as string)}</span>
                            </div>
                            </div>
                </>) :( <>
                <div className="flex items-start gap-3  justify-end">
                                <div>
                                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg rounded-tr-none max-w-xs h-14 bg-linear-65 from-purple-500 to-pink-500">
                                    {message.message}
                                </div>
                                <span className="text-xs text-gray-400 ml-1">{convertToHumanTime(message.createdAt as string)}</span>
                                </div>
                                <img src={loggedInUser?.image || ""}
                                 alt="User Avatar"  
                                className="w-8 h-8 rounded-full object-cover"/>
                            </div>
                </>)
            }
        
                            
            </React.Fragment>
        ))
    }
    </>)
    }