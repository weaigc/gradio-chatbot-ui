import { NextApiRequest, NextApiResponse } from 'next'
import { BingChat } from '../../_bots/bing'

const chatbot = new BingChat({
  cookie: process.env.BING_COOKIE!,
  ua: process.env.BING_UA!,
})
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const text = String(req.query.text);

  let lastLen = 0;
  res.setHeader('Content-Type', 'text/stream; charset=UTF-8');

  const response = await chatbot.sendMessage(text, {
    onMessage: (pres) => {
      res.write(pres.text.slice(lastLen));
      res.flushHeaders();
      lastLen = pres.text.length;
    },
  });
  res.end(response.text.slice(lastLen));
}
