import { FC } from 'react'
import { useChat } from '~app/hooks/use-chat'
import ConversationPanel from '../components/Chat/ConversationPanel'

interface Props {
  botName: string
}

const SingleBotChatPanel: FC<Props> = ({ botName }) => {
  const chat = useChat(botName)
  return (
    <div className="overflow-hidden h-full">
      <ConversationPanel
        botName={botName}
        bot={chat.bot}
        messages={chat.messages}
        onUserSendMessage={chat.sendMessage}
        generating={chat.generating}
        stopGenerating={chat.stopGenerating}
        resetConversation={chat.resetConversation}
      />
    </div>
  )
}

export default SingleBotChatPanel
