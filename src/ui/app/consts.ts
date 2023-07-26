import { spaces } from 'gradio-chatbot'

export const parseName = (url: string) => {
  console.log('url', url);
  const uri = new URL(url)
  const paths = uri.pathname.split('/')
  const name = paths.length > 3 ?
    paths[3] : /[a-z]/i.test(uri.hostname) && uri.hostname.split('.').length > 2 ?
    uri.hostname.split('.').at(-2) : uri.host
  return name!;
}

export const DEFAULT_CHATBOTS = spaces.map((space: string) => {
  // @ts-ignore
  const url: string = space?.url || space
  return {
    name: parseName(url),
    url,
    system: true,
  }
})

export const ALL_IN_ONE_PAGE_ID = 'all'

export const DEFAULT_CHATGPT_SYSTEM_MESSAGE =
  'You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: 2021-09-01. Current date: {current_date}'
