# Tic Tac Toe 

A full-stack multiplayer Tic Tac Toe game built with React (using Vite).

## Features

- **Real-time Multiplayer:** Play Tic Tac Toe with friends
- **Game Validation:** Join games with a name and optional avatar.
- **Room Management:** Create and join game rooms, handle disconnects, and reset games.
- **Modern UI:** Clean and responsive design using TailwindCSS.

## Tech Stack

- **Frontend:** React, JavaScript, Vite, TailwindCSS
- **Backend:** Node.js, Express, Socket.IO
- **Real-time Communication:** Socket.IO

## Setup and Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

### Setup

1. Clone the repository
```bash
git clone https://github.com/minhphung152/tic-tac-toe.git
```

2. Navigate to the `server` folder and install dependencies
```bash
cd server
npm install
```

3. Navigate to the `client` folder and install dependencies
```bash
cd client
npm install
```

4. Start the server
```bash
node server.js
```

5. Start the client application
```bash
npm run dev
```

## Usage
1. Open `http://localhost:5173` in your browser.
2. Enter a **Room Name**, your **Name**, and optionally an **Avatar URL**.
3. Click **Join Game**.
4. Open the same URL in another browser window or tab, and join using the same room name with a different name/avatar.
5. Click on the board to make your moves. The game will display the next turn, and notify when someone wins or if the game is a draw.
6. When the game ends, click **Reset Game** to play again. 

