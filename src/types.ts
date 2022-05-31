export type TextMessage = {
    message: string,
    userName: string,
    clientId: string,
    createdAt: string,
}

export type ImageMessage = {
    result: string,
    clientId: string,
}

export type GetAllMessagesResponse = {
    messages: Array<ImageMessage | TextMessage>
}
