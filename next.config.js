/** @type {import('next').NextConfig} */
const nextConfigHf = {
  output: 'export',
  assetPrefix: '/',
}

const nextConfig = {
  output: 'export',
  assetPrefix: '.',
}

module.exports = () => {
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    return {}
  }
  if (process.env.PUB === 'hf') {
    return nextConfigHf
  }
  return nextConfig
}
