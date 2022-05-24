import { socket } from './main'
import { format } from 'date-fns';
import $ from 'jquery'

export const createChatMessage = () => {
    socket.on('roomMessage', roomMsg => {
        $('<p>', {
            class: 'message--room',
            text: roomMsg
        }).appendTo($('.message'))
    })

    socket.on('image', image => {
        const img = getImage(image)
        console.log(image)
        if (socket.id === image.userID) {
            img.addClass('myMessage')
        }
    })

    socket.on('message', message => {
        const windowMessage: JQuery<HTMLElement> = $('.message')

        const sendMsg = createSendMessage(message)

        if (socket.id === message.clientID) {
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
            clientID: socket.id
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

export const createSendMessage = (message: { message: string; userName: string; clientID: string }) => {
    const textUser = $('<p>', {
        class: `message--user `,
        text: message.message,
        name: message.userName,
        'client-id': message.clientID
    }).appendTo($('.message'))

    $('<span>', {
        text: format(new Date(), "HH:mm")
    }).appendTo(textUser)

    return textUser
}

const getImage = (image: { src: { src: string } }) => {
    const img = $('<img>', {
        class: 'image',
        userID: socket.id,
        src: image.src.src,
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
                    socket.emit("send-img", {
                        src: reader.result,
                        userID: socket.id
                    })
                })

                $('.input--image').val('')
            }
        })
    })

    document.addEventListener('paste', (event) => {
        const target = event.clipboardData?.files
        if (target !== undefined) {
            const reader = new FileReader()

            const [file] = target

            reader.readAsDataURL(file)

            reader.onload = (() => {
                socket.emit('send-img', {
                    src: reader.result,
                    userID: socket.id
                })
            })
        }
    })
}

