import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { Realtime } from 'ably'
import { AblyProvider } from 'ably/react'
import { SessionProvider } from 'next-auth/react'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const client = new Realtime.Promise({
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

  return (
    <AblyProvider client={client}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </AblyProvider>
  )
}
