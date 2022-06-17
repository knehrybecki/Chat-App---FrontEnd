import { io } from 'socket.io-client'
import { createJoinUserToChat, renderChat, renderLoginToChat } from '../chat'
import '../style/reset.css'
import '../style/style.sass'

renderChat()
renderLoginToChat()
createJoinUserToChat()

export const socket = io('http://localhost:3000')