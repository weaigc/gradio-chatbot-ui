import { NextApiRequest, NextApiResponse } from 'next'
import { GradioChatBot } from 'gradio-chatbot'

const chatbot = new GradioChatBot('1');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const text = String(req.query.text);

  let lastLen = 0;
  res.setHeader('Content-Type', 'text/stream; charset=UTF-8');

  const response = await chatbot.chat(text, {
    onMessage: (msg: string) => {
      res.write(msg.slice(lastLen));
      res.flushHeaders();
      lastLen = msg.length;
    },
  });
  res.end(response.slice(lastLen));
}
