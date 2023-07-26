import { DEFAULT_CHATBOTS } from '../consts'
import { GradioBot } from './gradio'

export type BotName = string

export function createBotInstance(botName: string) {
  const bot = DEFAULT_CHATBOTS.find(bot => bot.name === botName)
  if (!bot) {
    console.error('use defalt model');
  }
  return new GradioBot(bot?.url!)
}

export type BotInstance = ReturnType<typeof createBotInstance>
