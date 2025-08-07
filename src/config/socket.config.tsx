import {io} from "socket.io-client" 
import { AppConfig } from "./config"

const socket = io(AppConfig.socketUrl, {
    retries: 3,
    autoConnect: false
})
export default socket