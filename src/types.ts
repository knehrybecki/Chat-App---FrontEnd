export type TextMessage = {
    message: string,
    userName: string,
    clientId: string,
    createdAt: string,
}

export type ImageMessage = {
    result: string,
    clientId: string,
    createdAt?: never,
    userName?: never,
    message?: never
}

export type GetAllMessagesResponse = {
    getAllMessage: Array<ImageMessage | TextMessage>
}
