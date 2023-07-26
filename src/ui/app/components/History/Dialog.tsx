import { FC, useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { DEFAULT_CHATBOTS } from '~app/consts'
import Dialog from '../Dialog'
import HistoryContent from './Content'
import { useTranslation } from 'react-i18next'

interface Props {
  botName: string
  open: boolean
  onClose: () => void
}

const HistoryDialog: FC<Props> = (props) => {
  const botName = useMemo(() => DEFAULT_CHATBOTS.find(bot => bot.name === props.botName)?.name, [props.botName])
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('')

  return (
    <Dialog
      title={`History conversations with ${botName}`}
      open={props.open}
      onClose={props.onClose}
      className="rounded-2xl w-[1000px] min-h-[400px]"
      borderless
    >
      {(
        <div className="border-b border-solid border-primary-border pb-[10px] mx-5">
          <div className="rounded-[30px] bg-secondary h-9 flex flex-row items-center px-4">
            <FiSearch size={18} className="mr-[6px] opacity-30" />
            <input
              className="bg-transparent w-full outline-none text-sm"
              placeholder={t('Search')!}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
      )}
      <HistoryContent botName={props.botName} keyword={keyword} />
    </Dialog>
  )
}

export default HistoryDialog
