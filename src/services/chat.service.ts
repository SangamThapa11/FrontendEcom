import axiosConfig from "../config/axios.config";
import type { IPaginationParams } from "../config/constants";

class ChatService {
    async detailChatMessage(userId: string, params: IPaginationParams) {
        return await axiosConfig.get('/v1/chat/'+userId, {
            params: params
        })
    }
    async sendMessage(messageBody: {receiver: string, message: string}) {
        return await axiosConfig.post('/v1/chat/', messageBody)
    }
}

export default new ChatService() 