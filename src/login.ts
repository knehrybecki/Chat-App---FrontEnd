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

        socket.emit('userData', {
            userName,
            roomName
        })

        window.history.pushState('http://localhost:3001/', 'Title', `/${roomName}/${userName}`)

        $('.chat__join').hide()
        $('.chat__input').show()
        $('.chat__title').show()
        
        createChatMessage()
    })
}
