import cx from 'classnames'
import { FC, memo, useCallback } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useSWRConfig } from 'swr'
import { deleteHistoryMessage } from '~services/chat-history'
import { ChatMessageModel } from '~types'
import Markdown from '../Markdown'

interface Props {
  botName: string
  message: ChatMessageModel
  conversationId: string
}

const ChatMessage: FC<Props> = ({ botName, message, conversationId }) => {
  const { mutate } = useSWRConfig()

  const deleteMessage = useCallback(async () => {
    await deleteHistoryMessage(botName, conversationId, message.id)
    mutate(`history:${botName}`)
  }, [botName, conversationId, message.id, mutate])

  if (!message.text) {
    return null
  }

  return (
    <div
      className={cx(
        'group relative py-5 flex flex-col gap-1 px-5 text-primary-text',
        message.author === 'user' ? 'bg-secondary' : 'bg-primary-background',
      )}
    >
      <div className="flex flex-row justify-between">
        <span className="text-xs text-secondary-tex">
          {message.author === 'user' ? 'You' : botName}
        </span>
        {!!conversationId && (
          <FiTrash2 className="invisible group-hover:visible cursor-pointer" onClick={deleteMessage} />
        )}
      </div>
      <Markdown>{message.text}</Markdown>
    </div>
  )
}

export default memo(ChatMessage)
