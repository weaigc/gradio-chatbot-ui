import { atomWithImmer } from 'jotai-immer'
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai/utils'
import { createBotInstance } from '~app/bots'
import { getDefaultThemeColor } from '~app/utils/color-scheme'
import { ChatMessageModel } from '~types'
import { uuid } from '~utils'

type Param = { botName: string; page: string }

export const chatFamily = atomFamily(
  (param: Param) => {
    return atomWithImmer({
      bot: createBotInstance(param.botName),
      messages: [] as ChatMessageModel[],
      generatingMessageId: '',
      abortController: undefined as AbortController | undefined,
      conversationId: uuid(),
    })
  },
  (a, b) => a.botName === b.botName && a.page === b.page,
)

export const sidebarCollapsedAtom = atomWithStorage('sidebarCollapsed', false)
export const themeColorAtom = atomWithStorage('themeColor', getDefaultThemeColor())
export const followArcThemeAtom = atomWithStorage('followArcTheme', false)
export const sidePanelBotAtom = atomWithStorage<string>('sidePanelBot', 'chatgpt')
