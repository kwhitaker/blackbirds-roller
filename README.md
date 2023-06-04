## What is this?
I'm running a [Blackbirds Game](https://www.amazon.com/Blackbirds-RPG-Powered-ZWEIHANDER/dp/1524869805), and want a quick way to handle rolls.
This is a little hobby project, but feel free to take it for your own needs, if that floats your boat.

## What does it do?
1. Quickly rolls skill rolls, damage rolls (exploding), or normal d10 rolls
2. Saves those rolls to a pocketbase instance
3. Broadcasts those rolls to a discord channel

## Is this production ready?
God no. There's a lot of bad UX and stuff I just won't finish. Have fun :smile:

## `.env` file
```bash
VITE_PB_URL=your-pocket-base-url
VITE_DISCORD_WEBHOOK_URL=your-discord-webhook-url
VITE_DISCORD_CHANNEL_ID=your-discord-channel-id
```

## Usage

```bash
$ npm install # or pnpm install or yarn install
```


## Available Scripts

In the project directory, you can run:

### `npm dev` or `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)
