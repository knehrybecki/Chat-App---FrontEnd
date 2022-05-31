import { format } from 'date-fns'
import $ from 'jquery'
import { socket } from './main'
import {
    GetAllMessagesResponse,
    ImageMessage,
    TextMessage
} from './types'

let allMessage: Array<ImageMessage | TextMessage> = []

export const createChatMessage = () => {
    const windowMessage = $('.message')
    const inputText = $('.input--text')

    socket.on('roomMessage', (roomMessage: string, allMessageInRoom: Array<GetAllMessagesResponse>) => {
        const [messages] = allMessageInRoom

        if (messages === undefined) {
            return
        }

        allMessage = allMessage.concat(messages.messages)

        addMessagesToRoom(allMessage)

        $('<p>', {
            class: 'message--room',
            text: roomMessage
        }).appendTo($('.message'))
    })

    socket.on('image', (image: ImageMessage) => {
        const img = getImage(image)

        if (socket.id === image.clientId) {
            img.addClass('myMessage')
        }

        allMessage = allMessage.concat(image)

        windowMessage.scrollTop(windowMessage?.get(0)?.scrollHeight!)
    })

    socket.on('message', (message: TextMessage) => {
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
            message: $('.input--text').val() as string,
            userName: $('.input--name').val() as string,
            clientId: socket.id,
            createdAt: hours
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

export const createSendMessage = (message: TextMessage) => {
    const textUser = $('<p>', {
        class: 'message--user',
        text: message.message,
        name: message.userName,
        'client-id': message.clientId
    }).appendTo($('.message'))

    $('<span>', {
        text: message.createdAt
    }).appendTo(textUser)

    return textUser
}

const addMessagesToRoom = (allMessages: Array<ImageMessage | TextMessage>) => {
    allMessages.forEach(message => {
        const text = message as TextMessage
        const image = message as ImageMessage

        if (text.userName === undefined) {
            $('<img>', {
                class: 'image',
                clientid: image.clientId,
                src: image.result,
                alt: 'img'
            }).appendTo($('.message'))

            return
        }

        const textUser = $('<p>', {
            class: 'message--user',
            text: text.message,
            name: text.userName,
            'client-id': text.clientId
        }).appendTo($('.message'))

        $('<span>', {
            text: text.createdAt
        }).appendTo(textUser)

        if (text.userName === $('.input--name').val()) {
            textUser.addClass('myMessage')
        }
    })
}

const getImage = (image: ImageMessage) => {
    const img = $('<img>', {
        class: 'image',
        clientid: image.clientId,
        src: image.result,
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
