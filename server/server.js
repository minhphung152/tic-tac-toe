const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // client URL
    methods: ["GET", "POST"],
  },
});

const PORT = 4000;

// Store games by room. Each game has board, turn, players, status, and optional winner.
const games = {};

// Check winning conditions
function checkWin(board) {
  const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for (const [a, b, c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Reset game board and status (but keep players)
function resetGame(game) {
  game.board = Array(9).fill(null);
  game.turn = 'X';
  game.status = 'playing';
  game.winner = null;
}

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a room with name and avatar data
  socket.on('joinGame', ({ room, name, avatar }) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);

    if (!games[room]) {
      // Create a new game state with the first player
      games[room] = {
        board: Array(9).fill(null),
        turn: 'X',
        status: 'playing', // playing | won | draw
        winner: null,
        players: [{ id: socket.id, name, avatar, mark: 'X' }],
      };
    } else {
      // Add second player if not already added (and assign mark 'O')
      if (games[room].players.length < 2) {
        games[room].players.push({ id: socket.id, name, avatar, mark: 'O' });
      }
    }
    // Emit the current game state to the room
    io.to(room).emit('gameUpdate', games[room]);
  });

  socket.on('makeMove', ({ room, index }) => {
    const game = games[room];
    if (!game || game.status !== 'playing') return;

    // Find the player data
    const player = game.players.find(p => p.id === socket.id);
    if (!player) return;

    // Validate move: check if square is empty and correct turn
    if (game.board[index] || game.turn !== player.mark) return;

    // Update board
    game.board[index] = player.mark;

    // Check for win or draw
    const winningMark = checkWin(game.board);
    if (winningMark) {
      game.status = 'won';
      game.winner = winningMark;
    } else if (game.board.every(cell => cell !== null)) {
      game.status = 'draw';
    } else {
      // Toggle turn: only if game is still playing
      game.turn = game.turn === 'X' ? 'O' : 'X';
    }

    // Broadcast update
    io.to(room).emit('gameUpdate', game);
  });

  // Allow a player to reset the game (only if game ended)
  socket.on('resetGame', ({ room }) => {
    const game = games[room];
    if (!game) return;
    if (game.status === 'playing') return; // only reset if game is finished

    resetGame(game);
    io.to(room).emit('gameUpdate', game);
  });

  socket.on('leaveGame', ({ room, name }) => {
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);

    // Remove player from game
    if (games[room]) {
      const idx = games[room].players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        games[room].players.splice(idx, 1);
        // Reset game if no players left
        if (games[room].players.length === 0) {
          delete games[room];
        } else {
          // If game has less than 2 players, end the game and declare the remaining player as the winner
          if (games[room].players.length === 1) {
            games[room].status = 'won';
            games[room].winner = games[room].players[0].mark;
          } else {
            resetGame(games[room]);
          }
          io.to(room).emit('gameUpdate', games[room]);
        }
      }
    }
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Remove disconnected player from any game
    for (const room in games) {
      const game = games[room];
      const idx = game.players.findIndex(p => p.id === socket.id);
      if (idx !== -1) {
        // Remove the player
        game.players.splice(idx, 1);
        // If game has less than 2 players, reset game state
        if (game.players.length < 2) {
          resetGame(game);
          io.to(room).emit('gameUpdate', game);
        }
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
