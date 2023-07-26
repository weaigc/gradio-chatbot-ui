import useSWR from 'swr/immutable'
import { DEFAULT_CHATBOTS } from '~app/consts'
import { getUserConfig } from '~services/user-config'

export function useEnabledBots() {
  const query = useSWR('enabled-bots', async () => {
    const { enabledBots } = await getUserConfig()
    return DEFAULT_CHATBOTS
      .filter((bot) => enabledBots.includes(bot.name))
  })
  return query.data || []
}
