import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gradiobot UI',
  description: 'Beautiful UI for Gradio Chatbot',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
