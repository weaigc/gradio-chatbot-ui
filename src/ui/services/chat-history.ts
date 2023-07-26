import { zip } from 'lodash-es'
import Browser from '~/browser-polyfill'
import { ChatMessageModel } from '~types'

/**
 * conversations:$botName => Conversation[]
 * conversation:$botName:$cid:messages => ChatMessageModel[]
 */

interface Conversation {
  id: string
  createdAt: number
}

type ConversationWithMessages = Conversation & { messages: ChatMessageModel[] }

async function loadHistoryConversations(botName: string): Promise<Conversation[]> {
  const key = `conversations:${botName}`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value || []
}

async function deleteHistoryConversation(botName: string, cid: string) {
  const conversations = await loadHistoryConversations(botName)
  const newConversations = conversations.filter((c) => c.id !== cid)
  await Browser.storage.local.set({ [`conversations:${botName}`]: newConversations })
}

async function loadConversationMessages(botName: string, cid: string): Promise<ChatMessageModel[]> {
  const key = `conversation:${botName}:${cid}:messages`
  const { [key]: value } = await Browser.storage.local.get(key)
  return value || []
}

export async function setConversationMessages(botName: string, cid: string, messages: ChatMessageModel[]) {
  const conversations = await loadHistoryConversations(botName)
  if (!conversations.some((c) => c.id === cid)) {
    conversations.unshift({ id: cid, createdAt: Date.now() })
    await Browser.storage.local.set({ [`conversations:${botName}`]: conversations })
  }
  const key = `conversation:${botName}:${cid}:messages`
  await Browser.storage.local.set({ [key]: messages })
}

export async function loadHistoryMessages(botName: string): Promise<ConversationWithMessages[]> {
  const conversations = await loadHistoryConversations(botName)
  const messagesList = await Promise.all(conversations.map((c) => loadConversationMessages(botName, c.id)))
  return zip(conversations, messagesList).map(([c, messages]) => ({
    id: c!.id,
    createdAt: c!.createdAt,
    messages: messages!,
  }))
}

export async function deleteHistoryMessage(botName: string, conversationId: string, messageId: string) {
  const messages = await loadConversationMessages(botName, conversationId)
  const newMessages = messages.filter((m) => m.id !== messageId)
  await setConversationMessages(botName, conversationId, newMessages)
  if (!newMessages.length) {
    await deleteHistoryConversation(botName, conversationId)
  }
}
