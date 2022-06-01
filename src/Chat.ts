import { format } from 'date-fns'
import $ from 'jquery'
import { socket } from './main'
import {
    GetAllMessagesResponse,
    ImageMessage,
    TextMessage
} from './types'

let allMessages: Array<ImageMessage | TextMessage> = []

export const createChatMessage = () => {
    const windowMessage = $('.message')
    const inputText = $('.input--text')

    socket.on('roomMessage', (roomMessage: string, allMessageInRoom: Array<GetAllMessagesResponse>) => {
        const textRoom = $('<p>', {
            class: 'message--room',
            text: roomMessage
        }).appendTo($('.message'))

        const [messages] = allMessageInRoom

        if (!messages) {
            return
        }

        allMessages = allMessages.concat(messages.messages)

        addMessagesToRoom(allMessages)

        textRoom.appendTo($('.message'))
    })

    socket.on('image', (image: ImageMessage) => {
        const img = getImage(image)

        if (socket.id === image.userUUID) {
            img.addClass('myMessage')
        }

        allMessages = allMessages.concat(image)

        windowMessage.scrollTop(windowMessage?.get(0)?.scrollHeight!)
    })

    socket.on('message', (message: TextMessage) => {
        const sendMsg = createSendMessage(message)

        if (socket.id === message.userUUID) {
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
            userName: $('.input--name').val() as string,
            userUUID: socket.id,
            roomUUID: $('.input--room').val() as string,
            createdAt: hours,
            text: $('.input--text').val() as string
        }

        allMessages = allMessages.concat(dataMessage)

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
        text: message.text,
        'client-id': message.userUUID
    }).appendTo($('.message'))

    $('<span>', {
        text: message.createdAt
    }).appendTo(textUser)

    return textUser
}

const addMessagesToRoom = (allMessages: Array<ImageMessage | TextMessage>) => {
    allMessages.forEach((message: ImageMessage | TextMessage )=> {
     const image = message as ImageMessage
     const text = message as TextMessage

        if (!message.userName) {
            $('<img>', {
                class: 'image',
                clientid: message.userUUID,
                src: image.imageUrl,
                alt: 'img'
            }).appendTo($('.message'))

            return
        }

        const textUser = $('<p>', {
            class: 'message--user',
            text: text.text,
            'client-id': message.userUUID
        }).appendTo($('.message'))

        $('<span>', {
            text: message.createdAt
        }).appendTo(textUser)

        if (message.userName === $('.input--name').val()) {
            textUser.addClass('myMessage')
        }
    })
}

const getImage = (image: ImageMessage) => {
    const img = $('<img>', {
        class: 'image',
        clientUUID: image.userUUID,
        src: image.imageUrl,
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
                    const imageUrl = reader.result
                    const userUUID = socket.id

                    socket.emit('send-img', {
                        imageUrl,
                        userUUID
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
                const imageUrl = reader.result
                const userUUID = socket.id
                socket.emit('send-img', {
                    imageUrl,
                    userUUID
                })
            })
        }
    })
}

window.addEventListener('DOMContentLoaded', () => {
    window.history.pushState('http://localhost:3001/', 'Title', '/')
})
