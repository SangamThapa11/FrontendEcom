import axiosConfig from "../config/axios.config"
import { type IRegisterData } from "../pages/auth/auth.contract";
import type { ICredentials } from "../pages/auth/LoginForm";
class AuthService {
    async registerUser(data: IRegisterData) {
        try {
            return await axiosConfig.post("/v1/auth/register", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (exception) {
            throw exception
        }
    }
    async activateUserProfile(token: string) {
        return await axiosConfig.get("/v1/auth/activate/" + token)
    }
    async loginUser(credentials: ICredentials) {
        return await axiosConfig.post('/v1/auth/login', credentials)
    }
    async getLoggedInUser() {
        return await axiosConfig.get("/v1/auth/me");
    }
    async forgetPasswordRequest(email: string) {
        return await axiosConfig.post("/v1/auth/forget-password", { email })
    }
    async verifyForgetToken(token: string) {
        const encodedToken = encodeURIComponent(token);
        return await axiosConfig.get(`/v1/auth/forget-password/${encodedToken}/verify`);
    }
     async resetPassword(verifiedToken: string, password: string) {
        return await axiosConfig.patch("/v1/auth/reset-password", {
            password,
            verifiedToken
        });
    }
}

const authSvc = new AuthService()
export default authSvc;