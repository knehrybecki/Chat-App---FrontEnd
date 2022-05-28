import $ from 'jquery'
import { createChatMessage } from './Chat'
import { socket } from './main'

export const createJoinUserToChat = () => {
    $('.join__button').click(event => {
        const userName = $('.input--name').val()
        const roomName = $('.input--room').val()
        const clientId = socket.id

        if (userName === '' || roomName === '') {
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
