export type PersonSendMessage = {
    message: string | number | string[] | undefined,
    userName: string | number | string[] | undefined,
    clientId: string,
    hoursSend: string
}

export type PersonSendImage = {
    src: {
        result: string,
        clientId: string
    }
}

export type AllGetMessageInRoom = {
    getAllMessage: [PersonSendImage | PersonSendMessage] 
}  
