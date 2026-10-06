# Game Shelf

Game Shelf is a Web App that allows you to search for games and get information about them. It uses the [RAWG Video Games Database API](https://rawg.io/apidocs) to get the data.

<a href="https://game-shelf.petrut.dev/" target="_blank" align="center"> Game Shelf is live here </a>

<a align="center" href="https://game-shelf.petrut.dev/" target="_blank">
  <img src="https://repository-images.githubusercontent.com/557423451/7a6c64c1-a0f7-414f-8506-0c2da47f468e" alt="Photo of the presentation of the project"/>
</a>

## Features

- Get a list of customized games based on a certain criteria
- Search for a specific game using various categories utilities
- Get details about a game
- Get a list of games made by a specific developer
- Get a list of games published by a specific publisher

## Technologies

- Vue 3 - Composition API
- Pinia
- Axios
- HTML5
- CSS3, SASS
- Node.js, Express (API proxy for RAWG)

## Project structure

This is an npm workspaces monorepo:

- `apps/client` - Vue 3 + Vite front end
- `apps/server` - Express server that proxies the RAWG API under `/api` and serves the built client

## Development

Requires Node.js 22.9 or newer.

- `npm install` (to install dependencies for every workspace)
- `cp .env.example apps/server/.env` and set your `RAWG_API_KEY`
- `npm run dev` (runs the client on http://localhost:5173 and the server on http://localhost:8080; Vite proxies `/api` to the server)
- `npm run lint`
- `npm run build` (builds the client into `apps/client/dist`)
- `npm start` (serves the API and the built client on http://localhost:8080)

## Deployment

The `Dockerfile` builds a single image that serves both the client and the API on port 8080:

```sh
docker build -t game-shelf .
docker run -p 8080:8080 -e RAWG_API_KEY=your-key game-shelf
```

Or with Compose: `RAWG_API_KEY=your-key docker compose up --build`.
