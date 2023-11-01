# Mosiac made using Ably

### This repo is for my submission for the Ably Realtime Experiences Hackathon which took place during September 18 - November 01, 2023 PDT

## Getting Started

### Either fork the repo or directly clone it

### Prerequisites

**Node version 18.17 or later  
**macOS, Windows (including WSL), and Linux are supported.

### To directly clone the repo

```shell
git clone https://github.com/trace2798/ably_spaces_fullstack.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```ts
# Deployment used by `npx convex dev` Convex credentials
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Auth Credentials
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Blog storage for images credentials
EDGE_STORE_ACCESS_KEY=
EDGE_STORE_SECRET_KEY=

#ABLY key
NEXT_PUBLIC_ABLY_API_KEY=
```

### Resources for env values:

Check the official docs for the services mentioned.

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
| `build` | To build your application                |
| `start` | Starts a production instance of the app  |

Youtube Demo Link: [Mosiac](https://youtu.be/waSnSibWkJA)
