import $ from 'jquery'
import { createChatMessage } from './Chat'
import { socket } from './main'

export const createJoinUserToChat = () => {
    $('.join__button').click(event => {
        const userName = $('.input--name')
        const roomName = $('.input--room')
        const clientId = socket.id

        if (userName.val() === '' || roomName.val() === '') {
            return
        }
        
        event.preventDefault()

        socket.emit('userData', {
            userName,
            roomName,
            clientId
        })

        window.history.pushState('http://localhost:3001/', 'Title', `/${roomName}/${userName}`)

        $('.chat__join').hide()
        $('.chat__input').show()
        $('.chat__title').show()
        
        createChatMessage()
    })
}
