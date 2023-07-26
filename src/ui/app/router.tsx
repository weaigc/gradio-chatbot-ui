import { createHashHistory, ReactRouter, RootRoute, Route, useParams } from '@tanstack/react-router'
import Layout from './components/Layout'
import MultiBotChatPanel from './pages/MultiBotChatPanel'
import SettingPage from './pages/SettingPage'
import SingleBotChatPanel from './pages/SingleBotChatPanel'
import { DEFAULT_CHATBOTS } from './consts'

const rootRoute = new RootRoute()

const layoutRoute = new Route({
  getParentRoute: () => rootRoute,
  component: Layout,
  id: 'layout',
})

const indexRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: MultiBotChatPanel,
})

function ChatRoute() {
  const { name } = useParams({ from: chatRoute.id })
  const bot = DEFAULT_CHATBOTS.find(bot => bot.name === name)
  return <SingleBotChatPanel botName={bot?.name || 'all'} />
}

const chatRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'chat/$name',
  component: ChatRoute,
})

const settingRoute = new Route({
  getParentRoute: () => layoutRoute,
  path: 'setting',
  component: SettingPage,
})

const routeTree = rootRoute.addChildren([layoutRoute.addChildren([indexRoute, chatRoute, settingRoute])])

const hashHistory = createHashHistory()
const router = new ReactRouter({ routeTree, history: hashHistory })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router }
