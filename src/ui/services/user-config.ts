import { defaults } from 'lodash-es'
import Browser from '~/browser-polyfill'
import { ALL_IN_ONE_PAGE_ID, DEFAULT_CHATBOTS } from '~app/consts'

const userConfigWithDefaultValue = {
  startupPage: ALL_IN_ONE_PAGE_ID,
  enabledBots: DEFAULT_CHATBOTS.slice(0, 8).map(bot => bot.name) as string[],
  allBots: DEFAULT_CHATBOTS,
  useProxy: false,
}

export type UserConfig = typeof userConfigWithDefaultValue

export async function getUserConfig(): Promise<UserConfig> {
  const result = await Browser.storage.sync.get(Object.keys(userConfigWithDefaultValue))
  return defaults(result, userConfigWithDefaultValue)
}

export async function updateUserConfig(updates: Partial<UserConfig>) {
  console.debug('update configs', updates)
  await Browser.storage.sync.set(updates)
  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) {
      await Browser.storage.sync.remove(key)
    }
  }
}
