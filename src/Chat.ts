import { format } from 'date-fns'
import $ from 'jquery'
import { socket } from './main'
import {
    GetAllMessagesResponse,
    ImageMessage,
    MessageType,
    sockets,
    TextMessage
} from './types'
import { addMessagesToRoom } from './Messages/addMessageToRoom'
import { addMessage } from './Messages/sendMessage'

let allMessages: Array<ImageMessage | TextMessage> = []
export const hours = format(new Date(), 'HH:mm')

export const createChatMessage = () => {
    const windowMessage = $('.message')
    const inputText = $('.input--text')

    socket.on(sockets.roomMessage, (roomMessage: string, allMessageInRoom: GetAllMessagesResponse) => {
        if (allMessageInRoom) {
            const allMessage = allMessageInRoom.allMessages

            allMessages = allMessages.concat(allMessage)

            addMessagesToRoom(allMessages)

            windowMessage.scrollTop(windowMessage?.get(0)?.scrollHeight!)
        }

        $('<p>', {
            class: 'message--room',
            text: roomMessage,
        }).appendTo($('.message'))
    })

    socket.on(sockets.image, (image: ImageMessage) => {
        const images = $('<img>', {
            class: 'image',
            clientUUID: image.userUUID,
            src: image.imageUrl,
            alt: 'img',
        }).appendTo($('.message'))

        if (socket.id === image.userUUID) {
            images.addClass('myMessage')
        }

        windowMessage.scrollTop(windowMessage?.get(0)?.scrollHeight!)
    })

    socket.on(sockets.message, (message: TextMessage) => {
        const sendMsg = addMessage(message)

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

        const dataMessage = {
            userName: $('.input--name').val() as string,
            userUUID: socket.id,
            roomUUID: $('.input--room').val() as string,
            createdAt: hours,
            text: $('.input--text').val() as string,
            type: MessageType.Text,
        }

        allMessages = allMessages.concat(dataMessage)

        socket.emit(sockets.chatMessage, dataMessage, allMessages)

        inputText.val('')
        inputText.focus()
    }

    $('.input--button').click(sendMessage)

    inputText.keypress(event => {
        if (event.which === 13) {
            sendMessage(event)
        }
    })

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

                    reader.onload = () => {
                        const dataMessage = {
                            userName: $('.input--name').val() as string,
                            userUUID: socket.id,
                            roomUUID: $('.input--room').val() as string,
                            createdAt: hours,
                            imageUrl: reader.result as string,
                            type: MessageType.Image,
                        }

                        allMessages = allMessages.concat(dataMessage)

                        socket.emit(sockets.sendImage, dataMessage, allMessages)
                    }

                    imageInput.val('')
                }
            })
        })

        document.addEventListener('paste', async (event: ClipboardEvent) => {
            const target = event.clipboardData?.files

            if (target) {
                const reader = new FileReader()
                const [file] = target

                reader.readAsDataURL(file)

                reader.onload = () => {
                    const dataMessage = {
                        userName: $('.input--name').val() as string,
                        userUUID: socket.id,
                        roomUUID: $('.input--room').val() as string,
                        createdAt: hours,
                        imageUrl: reader.result as string,
                        type: MessageType.Image,
                    }

                    allMessages = allMessages.concat(dataMessage)

                    socket.emit(sockets.sendImage, dataMessage, allMessages)
                }
            }
        })
    }
    sendImage()
}

window.addEventListener('DOMContentLoaded', () => {
    window.history.pushState('http://localhost:3001/', 'Title', '/')
})
