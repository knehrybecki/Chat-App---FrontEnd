import $ from 'jquery'
import { TextMessage } from '../types'

export const createSendMessage = (message: TextMessage) => {
    const textUser = $('<p>', {
        class: 'message--user',
        text: message.text,
        'client-id': message.userUUID,
    }).appendTo($('.message'))

    $('<span>', {
        text: message.createdAt,
    }).appendTo(textUser)

    return textUser
}
