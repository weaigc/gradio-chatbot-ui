export const random = (start: number, end: number) => {
  return Math.ceil(Math.random() * (end - start)) + start
}

export const randomIP = () => {
  return `13.${random(104, 107)}.${random(0, 255)}.${random(0, 255)}`
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
