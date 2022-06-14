export enum MessageType {
    Text = 'text',
    Image = 'image',
}

type Message = {
    personName: string
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
export enum Sockets {
    RoomMessage = 'roomMessage',
    Image = 'image',
    Message = 'message',
    ChatMessage = 'chatMessage',
    SendImage = 'sendImage',
    UserData= 'userData'
}