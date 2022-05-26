import { format } from 'date-fns'
import $ from 'jquery'
import { socket } from './main'
import { PersonSendImage, PersonSendMessage } from './types'

export const createChatMessage = () => {
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
    })

    socket.on('message', (message: PersonSendMessage) => {
        const windowMessage: JQuery<HTMLElement> = $('.message')
        const sendMsg = createSendMessage(message)

        if (socket.id === message.clientId) {
            sendMsg.addClass('myMessage')
        }

        windowMessage.scrollTop(windowMessage?.get(0)?.scrollHeight!)
    })

    const sendMessage = (event: JQuery.ClickEvent | JQuery.KeyPressEvent) => {
        if ($('.input--text').val() === '') {
            return
        }

        event.preventDefault()

        const sendMessage = $('.input--text')

        socket.emit('chatMessage', {
            message: sendMessage.val(),
            userName: $('.input--name').val(),
            clientId: socket.id
        })

        sendMessage.val('')
        sendMessage.focus()
    }

    $('.input--button').click(sendMessage)

    $('.input--text').keypress(event => {
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
        text: format(new Date(), 'HH:mm')
    }).appendTo(textUser)

    return textUser
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

        $('.input--image').change((event: JQuery.ChangeEvent) => {
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

                $('.input--image').val('')
            }
        })
    })

    document.addEventListener('paste', event => {
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

