import { ChatError } from '~utils/errors'

export interface ChatMessageModel {
  id: string
  author: 'user' | string
  text: string
  error?: ChatError
}

export interface ConversationModel {
  messages: ChatMessageModel[]
}
