import axios, { AxiosError, type AxiosResponse } from "axios";
import { AppConfig } from "./config";

const axiosConfig = axios.create({
    baseURL: AppConfig.apiBaseUrl,
    timeout: 30000,
    timeoutErrorMessage: "Server Time Out....",
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
    }
})

//Interceptors
// components ---------> axios-------->Interceptor-----------> network 
// server ----------> axios -----------> intercept ---------> component
axiosConfig.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("token_43")
    if (accessToken) {
        config.headers.Authorization = "Bearer " + accessToken
    }
    return config;
})
export interface AxiosSuccessResponse {
    data: any,
    message: string,
    status: string,
    options: any,
}
axiosConfig.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },
    (exception: AxiosError) => {
        if (exception.response) {
            throw { error: exception.response.data, code: exception.status }
        } else {
            throw {
                error: null,
                code: exception.status
            }
        }
    }
)
export default axiosConfig; 