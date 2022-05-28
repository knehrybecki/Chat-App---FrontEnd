import { format } from 'date-fns'
import $ from 'jquery'
import { socket } from './main'
import { PersonSendImage, PersonSendMessage } from './types'

export const createChatMessage = () => {
    const windowMessage = $('.message')
    const inputText = $('.input--text')

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
       
        socket.emit('chatMessage', {
            message: inputText.val(),
            userName: $('.input--name').val(),
            clientId: socket.id
        })

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
