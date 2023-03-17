import { useEffect } from 'react'

import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Inter } from 'next/font/google'
import { signOut, useSession } from 'next-auth/react'

import Client from '@/components/Client'
import { WhitePawn } from '@/svg/Pawn'

const inter = Inter({ subsets: ['latin'] })

export default function Game() {
  const {
    query: { id },
    ...router
  } = useRouter()
  const { status, data: session } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/')
    }
  }, [status, router])

  return (
    <>
      <Head>
        <title>Breakthrough - Game</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <div className="bg-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
            <div className="flex lg:flex-1">
              <Link href="/" className="-m-1.5 flex items-center p-1.5">
                <WhitePawn className="h-8 w-auto" alt="" />
                <h1 className="ml-3 text-base font-bold text-gray-900">
                  Breakthrough
                </h1>
              </Link>
            </div>
            <div className="ml-3 flex justify-end">
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => signOut()}
              >
                Log out <span aria-hidden="true">→</span>
              </a>
            </div>
          </nav>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {id && session?.user?.email && (
              <Client gameId={id.toString()} clientId={session.user.email} />
            )}
          </div>
        </div>
      </main>
    </>
  )
}
