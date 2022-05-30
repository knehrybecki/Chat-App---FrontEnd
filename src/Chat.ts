import { format } from 'date-fns'
import $ from 'jquery'
import { socket } from './main'
import {
    AllGetMessageInRoom,
    PersonSendImage,
    PersonSendMessage
} from './types'

let allMessage: Array<PersonSendImage | PersonSendMessage> = []

export const createChatMessage = async () => {
    const windowMessage = $('.message')
    const inputText = $('.input--text')

    socket.on('addMessageToRoom', (allMessageInRoom: Array<AllGetMessageInRoom>) => {
        if (allMessageInRoom.length === 0) {
            return
        }

        const [messages] = allMessageInRoom
        const msg = messages.getAllMessage

        allMessage = allMessage.concat(msg)

        addMessageToRoom(allMessage)
    })

    socket.on('roomMessage', (roomMessage: string) => {
        $('<p>', {
            class: 'message--room',
            text: roomMessage
        }).appendTo($('.message'))
    })

    socket.on('image', (image: PersonSendImage) => {
        const img = getImage(image)

        if (socket.id === image.src.clientId) {
            img.addClass('myMessage')
        }
        allMessage = allMessage.concat(image)

        windowMessage.scrollTop(windowMessage?.get(0)?.scrollHeight!)
    })

    socket.on('message', (message: PersonSendMessage) => {
        const sendMsg = createSendMessage(message)

        if (socket.id === message.clientId) {
            sendMsg.addClass('myMessage')
        }
        windowMessage.scrollTop(windowMessage?.get(0)?.scrollHeight!)
    })

    const sendMessage = (event: JQuery.ClickEvent | JQuery.KeyPressEvent) => {
        if (inputText.val() === '') {
            return
        }

        event.preventDefault()

        const hours = format(new Date(), 'HH:mm')

        const dataMessage = {
            message: inputText.val(),
            userName: $('.input--name').val(),
            clientId: socket.id,
            hoursSend: hours
        }

        allMessage = allMessage.concat(dataMessage)

        socket.emit('chatMessage', dataMessage)

        inputText.val('')
        inputText.focus()
    }

    $('.input--button').click(sendMessage)

    inputText.keypress(event => {
        if (event.which === 13) {
            sendMessage(event)
        }
    })

    sendImage()
}

export const createSendMessage = (message: PersonSendMessage) => {
    const textUser = $('<p>', {
        class: 'message--user',
        text: message.message,
        name: message.userName,
        'client-id': message.clientId
    }).appendTo($('.message'))

    $('<span>', {
        text: message.hoursSend
    }).appendTo(textUser)

    return textUser
}

const addMessageToRoom = allMessage => {
    allMessage.forEach((message) => {
        if (message.message === undefined) {
            $('<img>', {
                class: 'image',
                clientid: message.clientId,
                src: message.result,
                alt: 'img'
            }).appendTo($('.message'))

            return
        }
        const textUser = $('<p>', {
            class: 'message--user',
            text: message.message,
            name: message.userName,
            'client-id': message.clientId
        }).appendTo($('.message'))

        $('<span>', {
            text: message.hoursSend
        }).appendTo(textUser)

        if (message.userName === $('.input--name').val()) {
            textUser.addClass('myMessage')
        }
    })
}

const getImage = (image: PersonSendImage) => {
    const img = $('<img>', {
        class: 'image',
        clientid: image.src.clientId,
        src: image.src.result,
        alt: 'img'
    }).appendTo($('.message'))

    return img
}

const sendImage = () => {
    $('.fa-image').click(() => {
        const imageInput = $('.input--image')

        imageInput.click()

        imageInput.change((event: JQuery.ChangeEvent) => {
            const target = $(event.target).get(0).files

            if (target.length > 0) {
                const reader = new FileReader()

                const [file] = target

                reader.readAsDataURL(file)

                reader.onload = (() => {
                    const result = reader.result
                    const clientId = socket.id

                    socket.emit('send-img', {
                        result,
                        clientId
                    })
                })

                imageInput.val('')
            }
        })
    })

    document.addEventListener('paste', (event: ClipboardEvent) => {
        const target = event.clipboardData?.files

        if (target !== undefined) {
            const reader = new FileReader()
            const [file] = target

            reader.readAsDataURL(file)

            reader.onload = (() => {
                const result = reader.result
                const clientId = socket.id

                socket.emit('send-img', {
                    result,
                    clientId
                })
            })
        }
    })
}

window.addEventListener('DOMContentLoaded', () => {
    window.history.pushState('http://localhost:3001/', 'Title', '/')
})
