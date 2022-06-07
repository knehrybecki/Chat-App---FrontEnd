import $ from 'jquery'
import { ImageMessage, MessageType, TextMessage } from 'types'

export const addMessagesToRoom = (allMessages: Array<ImageMessage | TextMessage>) => {
    allMessages.forEach(message => {
        switch(message.type) {
            case MessageType.Image: {
                const image = message as ImageMessage

                $('<img>', {
                    class: 'image',
                    clientid: image.userUUID,
                    src: image.imageUrl,
                    alt: 'img',
                }).appendTo($('.message'))

                return
            }
            case MessageType.Text: {
                const text = message as TextMessage

                const textUser = $('<p>', {
                    class: 'message--user',
                    text: text.text,
                    'client-id': text.userUUID,
                }).appendTo($('.message'))

                $('<span>', {
                    text: text.createdAt,
                }).appendTo(textUser)

                if (text.personName === $('.input--name').val()) {
                    textUser.addClass('myMessage')
                }

                return
            }
        }
    })
}
