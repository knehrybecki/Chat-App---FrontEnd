import { io } from 'socket.io-client'
import { createJoinUserToChat } from 'chat'
import { renderChat, renderLoginToChat } from 'chat'
import 'style/reset.css'
import 'style/style.sass'

export const socket = io('http://localhost:3000')

renderChat()
renderLoginToChat()
createJoinUserToChat()
