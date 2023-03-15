import { Inter } from 'next/font/google'

import { WhitePawn } from '@/svg/Pawn'

const inter = Inter({ subsets: ['latin'] })

export default function Loading() {
  return (
    <main className={inter.className}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <WhitePawn
              aria-hidden="true"
              className="h-24 w-auto animate-bounce sm:h-28 lg:h-32"
            />
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loading...
            </h2>
          </div>
        </div>
      </div>
    </main>
  )
}
