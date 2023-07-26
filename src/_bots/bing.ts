import { fetch, setGlobalDispatcher, ProxyAgent, WebSocket } from 'undici';
import { randomUUID } from 'node:crypto'
import Debug from 'debug'
import assert from 'assert';
import { sleep } from './utils';
import { ChatError, ErrorCode } from './utils/error'
import  * as types from './utils/types'

const debug = Debug('bingai')
// const debug = (...msg: any) => console.log(...msg)
const httpProxy = process.env.http_proxy || process.env.HTTP_PROXY || process.env.https_proxy || process.env.HTTPS_PROXY;
if (httpProxy) {
  setGlobalDispatcher(new ProxyAgent(httpProxy));
}

const API_ENDPOINT = 'https://www.bing.com/turing/conversation/create'
// const API_ENDPOINT = 'https://edgeservices.bing.com/edgesvc/turing/conversation/create';

const terminalChar = '\x1e';

const OPTIONS_SETS = [
  'nlu_direct_response_filter',
  'deepleo',
  'disable_emoji_spoken_text',
  'responsible_ai_policy_235',
  'enablemm',
  'iycapbing',
  'iyxapbing',
  'objopinion',
  'rweasgv2',
  'dagslnv1',
  'dv3sugg',
  'autosave',
  'iyoloxap',
  'iyoloneutral',
  'clgalileo',
  'gencontentv3',
]

export class BingChat {
  protected cookie: string;
  protected ua: string;
  private _options: null | types.SendMessageOptions = null;

  constructor(opts: {
    cookie: string
    ua: string
  }) {
    const { cookie, ua } = opts
    this.cookie = cookie?.includes(';') ? cookie : `_EDGE_V=1; _U=${cookie}`
    this.ua = ua
  }

  static async createConversation(cookie: string, ua: string): Promise<types.ConversationResult> {
    const headers = {
      'Accept-Encoding': 'gzip, deflate, br, zsdch',
      'User-Agent': ua,
      'x-ms-useragent': 'azsdk-js-api-client-factory/1.0.0-beta.1 core-rest-pipeline/1.10.0 OS/Win32',
      cookie,
    }

    let resp: types.ConversationResult
    try {
      resp = await fetch(API_ENDPOINT, { headers, redirect: 'error' }).then(res => res.json()) as types.ConversationResult
      if (!resp.result) {
        throw new ChatError('Invalid response', ErrorCode.UNKOWN_ERROR)
      }
    } catch (err) {
      console.error('retry bing create', err)
      await sleep(6000)
      return this.createConversation(cookie, ua)
    }

    if (resp.result.value !== 'Success') {
      const message = `${resp.result.value}: ${resp.result.message}`
      if (resp.result.value === 'UnauthorizedRequest') {
        throw new ChatError(message, ErrorCode.BING_UNAUTHORIZED)
      }
      if (resp.result.value === 'Forbidden') {
        throw new ChatError(message, ErrorCode.BING_FORBIDDEN)
      }
      throw new ChatError(message, ErrorCode.UNKOWN_ERROR)
    }
    return resp
  }

  setState(opts: types.SendMessageOptions & Partial<Pick<types.ChatMessage, 'end' | 'text'>>) {
    if (!opts.text) {
      opts.text = 'No response';
      opts.end = true;
    }
    if (opts.end) {
      this._options = null;
      // opts.text += '\n\nSystem Info：New Bing closed this conversation. Please try again.'
    } else {
      this._options = {
        conversationExpiryTime: new Date(Date.now() + 4800000).toISOString(),
        clientId: opts.clientId,
        conversationId: opts.conversationId,
        conversationSignature: opts.conversationSignature,
        invocationId: opts.invocationId,
      };
    }
  }

  getState(): types.SendMessageOptions & Partial<Pick<types.ChatMessage, 'end' | 'text'>> | undefined {
    return this._options && new Date(this._options?.conversationExpiryTime as any).getTime() > Date.now() + 3600000 ? this._options : undefined;
  }

  async drawImage(prompt: string, id: string) {
    const headers = {
      'User-Agent': this.ua,
      cookie: this.cookie,
    }
    debug('start drawing', prompt)
    const { headers: responseHeaders } = await fetch(`https://www.bing.com/images/create?partner=sydney&re=1&showselective=1&sude=1&kseed=7000&SFX=&q=${encodeURIComponent(prompt)}&iframeid=${id}`,
      {
        method: 'HEAD',
        headers,
        redirect: 'manual',
      },
    );
    assert(/&id=([^&]+)$/.test(responseHeaders.get('location') || ''), '请求异常，请检查 cookie');
    const resultId = RegExp.$1;
    const imageThumbUrl = `https://www.bing.com/images/create/async/results/${resultId}?q=${encodeURIComponent(prompt)}&partner=sydney&showselective=1&IID=images.as`;
    do {
      await sleep(2000);
      const data = await fetch(imageThumbUrl, { headers }).then(res => res.text());
      debug('fetch results', data?.length);
      if (data?.length > 0) {
        return (data.match(/<img class="mimg"((?!src).)+src="[^"]+/mg)??[])
          .map(target => target.split('src="').pop()?.replace(/&amp;/g, '&'))
          .map(img => `![${prompt}](${img})`).join('\n')
      }
    } while(true);
  }

  async sendMessage(
    text: string,
    opts: types.SendMessageOptions = {}
  ): Promise<types.ChatMessage> {
    const {
      invocationId = '0',
      onMessage,
      locale = 'zh-CN',
      market = 'en-US',
      region = 'US',
      location = {
        lat: 47.639557,
        lng: -122.128159,
        re: 1000
      },
      locationHints = [
        {
          'country': 'United States',
          'state': 'California',
          'city': 'Los Angeles',
          'timezoneoffset': 8,
          'countryConfidence': 8,
          'Center': {
            'Latitude': 34.0536909,
            'Longitude': -118.242766
          },
          'RegionType': 2,
          'SourceType': 1
        }
      ],
      messageType = 'Chat',
      variant = 'Creative'
    } = opts;

    let { conversationId, clientId, conversationSignature } = this.getState() || opts;
    const isStartOfSession = !(
      conversationId &&
      clientId &&
      conversationSignature
    );

    if (isStartOfSession) {
      const conversation = await BingChat.createConversation(this.cookie, this.ua);
      conversationId = conversation.conversationId;
      clientId = conversation.clientId;
      conversationSignature = conversation.conversationSignature;
    }

    const result: types.ChatMessage = {
      author: 'bot',
      id: randomUUID(),
      conversationId: conversationId!,
      clientId: clientId!,
      conversationSignature: conversationSignature!,
      invocationId: `${parseInt(invocationId, 10) + 1}`,
      text: '',
    };

    const responseP = new Promise<types.ChatMessage>(
      async (resolve, reject) => {
        const chatWebsocketUrl = 'wss://sydney.bing.com/sydney/ChatHub';

        const ws = new WebSocket(chatWebsocketUrl, {
          headers: {
            'accept-language': 'zh-CN,zh;q=0.9',
            'cache-control': 'no-cache',
            'User-Agent': this.ua,
            pragma: 'no-cache',
            cookie: this.cookie,
          },
        })

        let isFulfilled = false

        function cleanup() {
          ws.close()
        }

        ws.addEventListener('error', (error) => {
          debug('WebSocket error:', error)
          cleanup()
          if (!isFulfilled) {
            isFulfilled = true
            reject(new Error(`WebSocket error: ${error.toString()}`))
          }
        })

        ws.addEventListener('close', () => {
          debug('ws closed')
        })

        const locationStr = location
          ? `lat:${location.lat};long:${location.lng};re=${location.re || '1000m'
          };`
          : undefined

        const optionsSets = OPTIONS_SETS
        if (variant === 'Precise') {
          optionsSets.push('h3precise')
        } else if (variant === 'Creative') {
          optionsSets.push('h3imaginative')
        }
        const params = {
          arguments: [
            {
              source: 'cib',
              optionsSets,
              allowedMessageTypes: [
                'ActionRequest',
                'Chat',
                'Context',
                'InternalSearchQuery',
                'InternalSearchResult',
                'Disengaged',
                'InternalLoaderMessage',
                'Progress',
                'RenderCardRequest',
                'AdsQuery',
                'SemanticSerp',
                'GenerateContentQuery',
                'SearchQuery'
              ],
              sliceIds: [
                'winmuid3tf',
                'osbsdusgreccf',
                'ttstmout',
                'crchatrev',
                'winlongmsgtf',
                'ctrlworkpay',
                'norespwtf',
                'tempcacheread',
                'temptacache',
                '505scss0',
                '508jbcars0',
                '515enbotdets0',
                '5082tsports',
                '515vaoprvs',
                '424dagslnv1s0',
                'kcimgattcf',
                '427startpms',
              ],
              isStartOfSession,
              message: {
                locale,
                market,
                region,
                location: locationStr,
                locationHints,
                author: 'user',
                inputMethod: 'Keyboard',
                messageType,
                text
              },
              conversationSignature,
              participant: { id: clientId },
              conversationId
            }
          ],
          invocationId,
          target: 'chat',
          type: 4
        }

        debug(chatWebsocketUrl, JSON.stringify(params))

        ws.addEventListener('open', () => {
          ws.send(`{"protocol":"json","version":1}${terminalChar}`)
          ws.send(`{"type":6}${terminalChar}`)
          ws.send(`${JSON.stringify(params)}${terminalChar}`)
        })

        ws.addEventListener('message', async (event) => {
          const objects = event.data?.split(terminalChar) as string[]

          const messages = objects
            .map((object) => {
              try {
                return JSON.parse(object)
              } catch (error) {
                return object
              }
            })
            .filter(Boolean)

          if (!messages.length) {
            return
          }

          for (const message of messages) {
            // debug(JSON.stringify(message))
            // console.log(message.type)
            if (Math.ceil(Date.now() / 1000) % 6 === 0) {
              ws.send(`{"type":6}${terminalChar}`)
            }

            if (message.type === 1) {
              const update = message as types.ChatUpdate
              const msg = update.arguments[0].messages?.[0]

              if (!msg) continue

              // console.log('RESPONSE0', JSON.stringify(update, null, 2))

              if (!msg.messageType) {
                result.author = msg.author
                result.text = msg.text
                result.detail = msg

                onMessage?.(result)
              }
            } else if (message.type === 2) {
              const response = message as types.ChatUpdateCompleteResponse
              const validMessages = response.item.messages?.filter(
                (m) => !m.messageType && m.author === 'bot'
              )
              const lastMessage = validMessages?.at(-1)

              if (lastMessage) {
                result.conversationExpiryTime = response.item.conversationExpiryTime
                result.author = lastMessage.author
                result.text = lastMessage.text || (lastMessage.adaptiveCards ?? []).map(card => card.body.map(body => body.text).join('\n')).join('\n')
                result.contentType = response.item.messages.at(-1)?.contentType
                if (result.contentType === 'IMAGE') {
                  result.prompt = response.item.messages.at(-1)?.text
                }
                result.messageId = lastMessage.messageId
                result.detail = lastMessage
                result.end = response.item?.messages.at(-1)?.messageType === 'Disengaged' || response.item.throttling.numUserMessagesInConversation >= response.item.throttling.maxNumUserMessagesInConversation
              } else if (response.item.result.value) {
                result.text = response.item.result.value
              }
            } else if (message.type === 7) {
              ws.send(`{"type":7}${terminalChar}`)
            } else if (message.type === 6) {
              ws.send(`{"type":6}${terminalChar}`)
            } else if (message.type === 3) {
              isFulfilled = true
              if (result.contentType === 'IMAGE' && result.prompt) {
                result.text += '\n' + await this.drawImage(result.prompt, result.messageId!)
              }
              this.setState(result)
              resolve(result)
              cleanup()
            }
          }
        })
      }
    )

    return responseP
  }
}
