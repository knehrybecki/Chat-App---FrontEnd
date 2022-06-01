export interface TextMessage  {
    message: string,
    userName: string,
    clientId: string,
    createdAt: string,
}

export interface ImageMessage  {
    result: string,
    clientId: string,
}

export interface GetAllMessagesResponse  {
    messages: Array<ImageMessage | TextMessage>
}
