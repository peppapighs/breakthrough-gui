import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { configureAbly } from '@ably-labs/react-hooks'
import { SessionProvider } from 'next-auth/react'

import { PyodideProvider } from '@/hooks/usePyodide'

configureAbly({
  authCallback: async (_, callback) => {
    try {
      const response = await fetch('/api/ably', { method: 'POST' })
      const tokenRequest = await response.json()
      callback(null, tokenRequest)
    } catch (e) {
      callback(e as any, null)
    }
  },
})

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <PyodideProvider>
        <Component {...pageProps} />
      </PyodideProvider>
    </SessionProvider>
  )
}
