# Breakthrough GUI

A web application for testing Breakthrough 6x6 AI and competing with your friends.

## Getting Started

1. Create a copy of `.env.example` called `.env.local` and configuring each value as follows:

   | Name              | Description                                                                                   |
   | ----------------- | --------------------------------------------------------------------------------------------- |
   | `NEXTAUTH_URL`    | Leave as `http://localhost:3000` for local development.                                       |
   | `NEXTAUTH_SECRET` | A random string used for authentication. Run `openssl rand -base64 32` to generate a new one. |
   | `GITHUB_ID`       | The client ID of your GitHub OAuth app.                                                       |
   | `GITHUB_SECRET`   | The client secret of your GitHub OAuth app.                                                   |
   | `ABLY_SECRET`     | The secret key of your Ably app.                                                              |

   For more information about NextAuth.js configuration, see [the documentation](https://next-auth.js.org/providers/github).

1. Install dependencies:

   ```bash
   pnpm install
   ```

1. Start the development server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The easiest way to deploy this application is to use [Vercel](https://vercel.com/).

## Usage

1. Sign in with your GitHub account.
1. Create a new game.
1. Share the game link with your friend.
1. Click "Switch View" to invert the board.
1. Click "Reset" to start a new game.
1. Upload your AI as a Python file and click "Bot move" to make a move. Your Python file should contain `PlayerAI` class with a `make_move()` method accepting the board state and returning a move. Your Python file should also only use standard libraries and `utils.py` provided in the class. No need to upload `utils.py` as the module is stored statically in `public/utils.whl`. If there is any update to the `utils.py`, please recompile them into wheel file and replace the one in the `public` directory.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
