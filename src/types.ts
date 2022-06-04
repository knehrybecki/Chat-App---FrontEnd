export enum MessageType {
    Text = 'text',
    Image = 'image',
}

type Message = {
    userName: string
    userUUID: string
    roomUUID: string
    createdAt: string
}

export interface TextMessage extends Message {
    text: string
    type: MessageType
}

export interface ImageMessage extends Message {
    imageUrl: string
    type: MessageType
}

export interface GetAllMessagesResponse {
    allMessages: Array<ImageMessage | TextMessage>
}

export enum sockets {
    roomMessage = 'roomMessage',
    image = 'image',
    message = 'message',
    chatMessage = 'chatMessage',
    sendImage = 'sendImage',
    userData= 'userData'
}