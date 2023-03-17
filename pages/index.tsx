import Head from 'next/head'
import { useRouter } from 'next/router'

import { nanoid } from 'nanoid'
import { Inter } from 'next/font/google'
import { signIn, signOut, useSession } from 'next-auth/react'

import Loading from '@/components/Loading'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter()
  const { status } = useSession()

  const createNewGame = () => {
    router.push(`/game/${nanoid(10)}`)
  }

  if (status === 'loading') {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>Breakthrough - Home</title>
        <meta
          name="description"
          content="A frontend UI for CS2109S mini project - Breakthrough"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <div className="flex min-h-screen flex-col items-center justify-center bg-white">
          <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Welcome to Breakthrough GUI
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600"></p>
              <div className="mt-10">
                {status === 'unauthenticated' ? (
                  <button
                    type="button"
                    className="rounded-md bg-indigo-600 py-3 px-4 text-xl font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => signIn('github')}
                  >
                    Sign in with GitHub
                  </button>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
                    <button
                      type="button"
                      className="rounded-md bg-indigo-600 py-3 px-4 text-xl font-bold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={createNewGame}
                    >
                      Create a new game
                    </button>
                    <a
                      href="#"
                      className="text-xl font-semibold leading-6 text-gray-900"
                      onClick={() => signOut()}
                    >
                      Log out <span aria-hidden="true">→</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
