export interface Chats {
    _id: string,
    user: string,
  }
  
export interface Messages {
    id?: string,
    chat_id: string,
    to: string,
    from: string,
    timestamp: number,
    type: string,
    message: string,
  }