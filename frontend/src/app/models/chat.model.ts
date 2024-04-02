import { Preference } from "./preferences.model";

export interface Chats {
    _id: string,
    user: string,
  }

export interface UserMessages {
  messages: Messages[],
  preferences: Preference[]
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