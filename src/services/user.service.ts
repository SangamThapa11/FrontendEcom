import axiosConfig from "../config/axios.config";
import type { IPaginationParams } from "../config/constants";


class UserService {
    async getAllUSers(params: IPaginationParams) {
        return await axiosConfig.get("/v1/user", {
            params: params
        })
    }
    async deleteUserById(userId: string) {
        return await axiosConfig.delete('/v1/users/'+userId)
    }
    async getUserById(userId: string) {
        return axiosConfig.get('/v1/users/'+userId)
    }
    async updateUserImage(userId: string, data: FormData) {
    return await axiosConfig.patch("/v1/users/" + userId + "/image", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}
    async updateUser(userId: string, data: { name: string }) {
    return await axiosConfig.patch("/v1/users/" + userId, data);
}
    
}

export default new UserService(); 

