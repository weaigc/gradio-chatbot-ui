'use client'

import dynamic from 'next/dynamic'
import { getUserThemeMode } from '@/ui/services/theme'
import '@/ui/app/base.scss'
import logo from '~/assets/logo.svg'

const ClientComponent = dynamic(
  () => import('@/ui/app/main'),
  { ssr: false }
)

export default function Index() {
  const theme = getUserThemeMode();
  return (
    <html lang="en" className={theme}>
      <body>
        <ClientComponent />
      </body>
    </html>
  )
}
