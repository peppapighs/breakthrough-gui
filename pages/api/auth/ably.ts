import { NextApiRequest, NextApiResponse } from 'next'

import { Rest } from 'ably'
import { getServerSession } from 'next-auth'

import { authOptions } from './[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user) {
    res.status(401).send('Unauthorized')
    return
  }

  const { method } = req
  if (method === 'POST') {
    const ably = new Rest({ key: process.env.ABLY_API_KEY })
    ably.auth.createTokenRequest(
      { clientId: session.user.email || '' },
      null,
      (err, tokenRequest) => {
        if (err) {
          res.status(500).send(err.message)
        } else {
          res.status(200).json(tokenRequest)
        }
      }
    )
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
