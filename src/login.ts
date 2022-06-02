import $ from 'jquery'
import { createChatMessage } from './Chat'
import { socket } from './main'

export const createJoinUserToChat = () => {
    $('.join__button').click(event => {
        const userName = $('.input--name').val() as string
        const roomUUID = $('.input--room').val() as string
        const userUUID = socket.id

        if (userName === '' || roomUUID === '') {
            return
        }

        event.preventDefault()

        socket.emit('userData', {
            userName,
            userUUID,
            roomUUID,
        })

        window.history.pushState('http://localhost:3001/', 'Title', `/${roomUUID}/${userName}`)

        $('.chat__join').hide()
        $('.chat__input').show()
        $('.chat__title').show()

        createChatMessage()
    })
}
