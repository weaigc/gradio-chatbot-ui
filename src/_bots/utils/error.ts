export enum ErrorCode {
  BING_UNAUTHORIZED = 'BING_UNAUTHORIZED',
  BING_FORBIDDEN = 'BING_FORBIDDEN',
  BING_CAPTCHA = 'BING_CAPTCHA',
  UNKOWN_ERROR = 'UNKOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

export class ChatError extends Error {
  code: ErrorCode
  constructor(message: string, code: ErrorCode) {
    super(message)
    this.code = code
  }
}
