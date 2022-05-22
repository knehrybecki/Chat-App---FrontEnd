import { createChatMessage } from './Chat'
import { socket } from './main'
import $ from 'jquery'

export const createJoinUserToChat = () => {
    $('.join__button').click(event => {
        const userName = $('.input--name').val()

        const roomName = $('.input--room').val()

        if (userName === '' && roomName === '') {
            return
        }
        
        event.preventDefault()

        socket.emit('new-user', userName)

        socket.emit('room', roomName)

        $('.chat__join').hide()
        $('.chat__input').show()
        $('.chat__title').show()

        createChatMessage()
    })
}
