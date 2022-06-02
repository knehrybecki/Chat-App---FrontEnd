export enum MessageType {
    Text = 'text',
    Image = 'image'
}

type Message = {
    userName: string,
    userUUID: string,
    roomUUID: string,
    createdAt: string,
}

export interface TextMessage extends Message {
    text: string,
    type: string
}

export interface ImageMessage extends Message {
    imageUrl: string,
    type: string
}

export interface GetAllMessagesResponse {
    messages: Array<ImageMessage | TextMessage>
}
