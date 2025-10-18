# Stage0 Profile Endpoint

Simple Node.js api that exposes a single endpoint to return a static user profile plus a cat fact fetched from the public Cat Fact API.

- Server entry: [`app.js`](app.js) (see [`app.get('/me')`](app.js))
- Logger helper: [`logEvents`](logger.js) (see [`logger.js`](logger.js))

Workspace files:
- [app.js](app.js)
- [logger.js](logger.js)
- [package.json](package.json)
- [logs/errorLog.txt](logs/errorLog.txt)
- [.gitignore](.gitignore)
- [readme.md](readme.md)

## Tech stack
- Node.js (JavaScript)
- Express (web framework)
- Axios (HTTP client)
- date-fns (timestamp formatting)
- uuid (request IDs)
- CORS middleware

## Features
- GET /me endpoint that returns a user profile and a cat fact (fetched from https://catfact.ninja/fact)
- Simple file-based logging via [`logEvents`](logger.js) into `logs/requestLog.txt` and `logs/errorLog.txt`
- 10 second request timeout for the cat fact API; timeout errors are detected and logged

## Installation

Prerequisites:
- Node.js (v16+ recommended)
- npm

Install and run:

```sh
# clone repo (if needed), then
npm install
npm start
```

The server listens on port 3000 by default. To change the port, set the PORT environment variable:

```sh
PORT=8080 npm start
```

## Usage

Request:

```sh
curl -s http://localhost:3000/me | jq
```

Successful response (200):

```json
{
  "status": "success",
  "user": {
    "name": "Anaele Joshua",
    "email": "anaelejoshua0508@gmail.com",
    "stack": "Node.js"
  },
  "timestamp": "2025-10-18T05:30:21.000Z",
  "fact": "Cats are awesome..."
}
```

On error (e.g., cat fact API unavailable or timed out), the service returns a 500 with a helpful message.

## Logging

All logging is handled by the helper exported in [`logger.js`](logger.js) — see [`logEvents`](logger.js). Log entries are appended to `logs/`:

- `logs/requestLog.txt` — successful requests
- `logs/errorLog.txt` — errors (see an example file: [logs/errorLog.txt](logs/errorLog.txt))

Log format:
```
YYYY-MM-DD<TAB>HH:mm:ss<TAB><UUID><TAB><MESSAGE>
```

The app treats an Axios timeout (10s) as a special case (error code `ECONNABORTED`) and logs `Timeout fetching cat fact` before returning a timeout-specific message to the client.

## Development notes

- Main logic lives in [`app.js`](app.js). Route: [`app.get('/me')`](app.js).
- Logger helper is in [`logger.js`](logger.js) and creates the `logs/` directory if it does not exist.
- Dependencies are listed in [`package.json`](package.json).

## Testing

No automated tests are included. To test manually:
- Run the server (`npm start`) and call GET /me.
- Inspect `logs/requestLog.txt` and `logs/errorLog.txt` for entries.

## Contributing

- Open an issue describing the change.
- Fork, create a branch, add changes, and make a pull request.

## License

This repository uses the license specified in [`package.json`](package.json). Review and