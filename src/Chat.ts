import { socket } from './main'
import moment from 'moment'
import $ from 'jquery'

export const createChatMessage = () => {
    socket.on('roomMessage', roomMsg => {
        $('<p>', {
            class: 'message--room',
            text: roomMsg
        }).appendTo($('.message'))
    })

    socket.on('image', image => {
       const img =  getImage(image)

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

    const SendMessage = (event: any) => {
        if ($('.input--text').val() === '') {
            return
        }

        event.preventDefault()

        const SendMessage = $('.input--text')

        socket.emit('chatMessage', {
            message: SendMessage.val(),
            userName: $('.input--name').val(),
            clientID: socket.id
        })

        SendMessage.val('')
        SendMessage.focus()
    }

    $('.input--button').click(SendMessage)

    $('.input--text').keypress(event => {
        if (event.which === 13) {
            SendMessage(event)
        }
    })

    sendImage()
}

export const createSendMessage = (message: any) => {
    const textUser = $('<p>', {
        class: `message--user `,
        text: message.message,
        name: message.userName,
        'client-id': message.clientID
    }).appendTo($('.message'))

    $('<span>', {
        text: moment().format('h:mm')
    }).appendTo(textUser)

    return textUser
}

const getImage = (image: any) => {
    const img  = $('<img>', {
          class: 'image',
          userID: socket.id,
          src: image.src.src,
          alt: 'img'
      }).appendTo($('.message'))

      return img
  }

const sendImage = () => {
    $('.fa-image').click(() => {
        $('.input--image').click()

        document.addEventListener('keypress', event => {
            if (event.which === 13) {
                const ourFile = $('.input--image')[0].files

                if (ourFile.length > 0) {
                    const reader = new FileReader()

                    reader.readAsDataURL(ourFile[0])

                    reader.onload = (() => {
                        socket.emit("send-img", {
                           src: reader.result,
                           userID: socket.id
                        })
                    })
                }
                $('.input--image').val('')
            }
        })
    })

    document.addEventListener('paste', event => {
        if (event.clipboardData?.files?.length! > 0) {
            const ourFile = event.clipboardData?.files[0]!

            const reader = new FileReader()

            reader.readAsDataURL(ourFile)

            reader.onload = (() => {
                socket.emit('send-img', {
                src: reader.result,
                userID: socket.id
             })
            })
        }
    })
}
