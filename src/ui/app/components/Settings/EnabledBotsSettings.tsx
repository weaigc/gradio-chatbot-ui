import { FC, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { BotName } from '~app/bots'
import { DEFAULT_CHATBOTS } from '~app/consts'
import { UserConfig } from '~services/user-config'
import { Switch } from '@headlessui/react'
import { Input } from '../Input'

interface Props {
  userConfig: UserConfig
  updateConfigValue: (update: Partial<UserConfig>) => void
}

const EnabledBotsSettings: FC<Props> = ({ userConfig, updateConfigValue }) => {
  const { t } = useTranslation()
  const updateStatus = useCallback(
    (botName: BotName, enabled: boolean) => {
      const bots = new Set(userConfig.enabledBots)
      if (enabled) {
        bots.add(botName)
      } else {
        if (bots.size === 1) {
          alert('At least one bot should be enabled')
          return
        } else {
          bots.delete(botName)
        }
      }
      updateConfigValue({ enabledBots: Array.from(bots) })
    },
    [updateConfigValue, userConfig.enabledBots],
  )

  return (
    <div className="flex flex-col gap-3 flex-wrap w-full">
      {DEFAULT_CHATBOTS.map((bot) => {
        const enabled = userConfig.enabledBots.includes(bot.name)
        return (
          <div className="flex flex-row gap-[12px] w-full items-center" key={bot.name}>
            <Switch
              id={`bot-checkbox-${bot.name}`}
              checked={enabled}
              className={`${
                enabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
              onChange={(checked) => updateStatus(bot.name, checked)}
            >
              <span
                className={`${
                  enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <span className="text-sm font-semibold block ml-6">{t('Bot Name')}</span>
            <Input className="w-1/6" name="title" defaultValue={bot.name} />
            <span className="text-sm font-semibold block ml-6">{t('Space URL')}</span>
            <Input className="w-3/6" name="title" defaultValue={bot.url} />
          </div>
        )
      })}
    </div>
  )
}

export default EnabledBotsSettings
