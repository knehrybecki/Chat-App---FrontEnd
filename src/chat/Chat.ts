import { format } from 'date-fns'
import $ from 'jquery'
import { socket } from '../app'
import { addMessage, addMessagesToRoom, errorHandling } from '../messages'
import {
    GetAllMessagesResponse,
    ImageMessage,
    MessageType,
    Sockets,
    TextMessage
} from '../types'

let allMessagesArray: Array<ImageMessage | TextMessage> = []
export const hours = format(new Date(), 'HH:mm')

export const createChatMessage = () => {
    const windowMessage = $('.message')
    const inputText = $('.input--text')

    socket.on(Sockets.RoomMessage, (roomMessage: string, allMessageInRoom: GetAllMessagesResponse) => {
        if (allMessageInRoom) {
            const { allMessages } = allMessageInRoom

            allMessagesArray = allMessagesArray.concat(allMessages)

            addMessagesToRoom(allMessages)

            windowMessage.scrollTop(windowMessage?.get(0)?.scrollHeight!)
        }

        $('<p>', {
            class: 'message--room',
            text: roomMessage,
        }).appendTo($('.message'))
    })

    socket.on(Sockets.Image, (socketMessage: ImageMessage) => {
        const images = $('<img>', {
            class: 'image',
            clientUUID: socketMessage.userUUID,
            src: socketMessage.imageUrl,
            alt: 'img',
        }).appendTo($('.message'))

        if (socket.id === socketMessage.userUUID) {
            images.addClass('myMessage')
        }

        windowMessage.scrollTop(windowMessage?.get(0)?.scrollHeight!)
    })

    socket.on(Sockets.Message, (socketMessage: TextMessage ) => {
        const sentMessage = addMessage(socketMessage)


        if (socket.id === socketMessage.userUUID) {
            sentMessage.addClass('myMessage')
        }

        windowMessage.scrollTop(windowMessage?.get(0)?.scrollHeight!)
    })

    const sendMessage = (event: JQuery.ClickEvent | JQuery.KeyPressEvent) => {
        if (inputText.val() === '') {
            return
        }

        event.preventDefault()

        const dataMessage = {
            personName: $('.input--name').val() as string,
            userUUID: socket.id,
            roomUUID: $('.input--room').val() as string,
            createdAt: hours,
            text: $('.input--text').val() as string,
            type: MessageType.Text,
        }

        allMessagesArray = allMessagesArray.concat(dataMessage)

        socket.emit(Sockets.ChatMessage, dataMessage, allMessagesArray)

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
                            personName: $('.input--name').val() as string,
                            userUUID: socket.id,
                            roomUUID: $('.input--room').val() as string,
                            createdAt: hours,
                            imageUrl: reader.result as string,
                            type: MessageType.Image,
                        }

                        allMessagesArray = allMessagesArray.concat(dataMessage)

                        socket.emit(Sockets.SendImage, dataMessage, allMessagesArray)
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
                        personName: $('.input--name').val() as string,
                        userUUID: socket.id,
                        roomUUID: $('.input--room').val() as string,
                        createdAt: hours,
                        imageUrl: reader.result as string,
                        type: MessageType.Image,
                    }

                    allMessagesArray = allMessagesArray.concat(dataMessage)

                    socket.emit(Sockets.SendImage, dataMessage, allMessagesArray)
                }
            }
        })
    }
    sendImage()
    errorHandling()
}

window.addEventListener('DOMContentLoaded', () => {
    window.history.pushState('http://localhost:3001/', 'Title', '/')
})
