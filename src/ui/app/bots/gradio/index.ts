import { ChatError, ErrorCode } from '~utils/errors'
import { AbstractBot, SendMessageParams } from '../abstract-bot'
import { GradioChatBot, generateHash } from 'gradio-chatbot'

interface ConversationContext {
  sessionHash: string
  chatbot: GradioChatBot
}

export class GradioBot extends AbstractBot {
  public model: string
  private conversationContext?: ConversationContext

  constructor(model: string) {
    super()
    this.model = model
  }

  async doSendMessage(params: SendMessageParams) {
    if (!this.conversationContext) {
      this.conversationContext = { sessionHash: generateHash(), chatbot: new GradioChatBot(this.model) }
    }

    await this.conversationContext.chatbot.chat(params.prompt, {
      onMessage: (text: string) => {
        params.onEvent({
          type: 'UPDATE_ANSWER',
          data: {
            text,
          }
        })
      },
    }).catch((error) => {
      params.onEvent({
        type: 'ERROR',
        error: new ChatError(error, ErrorCode.GRADIO_ERROR),
      })
    })
    params.onEvent({
      type: 'DONE'
    })
  }

  resetConversation() {
    this.conversationContext = undefined
  }
}
