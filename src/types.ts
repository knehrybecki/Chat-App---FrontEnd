type Message = {
    userName: string,
    userUUID: string,
    roomUUID: string,
    createdAt: string,
  }

  export interface TextMessage extends Message {
    text: string
  }
  
  export interface ImageMessage extends Message {
    imageUrl: string,
  }

export interface GetAllMessagesResponse  {
    messages: Array<ImageMessage | TextMessage>
}
