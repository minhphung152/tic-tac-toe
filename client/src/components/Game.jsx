import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = "http://localhost:4000";

const Game = () => {
  const [socket, setSocket] = useState(null);
  const [game, setGame] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const room = params.get('room');
  const name = params.get('name');
  const avatar = decodeURIComponent(params.get('avatar'));

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.emit('joinGame', { room, name, avatar });

    newSocket.on('gameUpdate', (updatedGame) => {
      setGame(updatedGame);
    });

    return () => newSocket.close();
  }, [room, name, avatar]);

  const handleClick = (index) => {
    if (!game || game.board[index] || game.status !== 'playing') return;
    socket.emit('makeMove', { room, index });
  };

  const handleLeave = () => {
    socket.emit('leaveGame', { room, name });
    navigate('/')
  }

  const handleReset = () => {
    socket.emit('resetGame', { room });
  };

  const renderSquare = (index) => (
    <button
      onClick={() => handleClick(index)}
      className="w-20 h-20 border-2 border-gray-300 flex justify-center items-center text-4xl font-bold hover:bg-gray-200 transition-colors"
    >
      {game?.board[index]}
    </button>
  );

  const renderPlayers = () => (
    <div className="flex space-x-4 mb-4">
      {game?.players.map((player) => (
        <div key={player.id} className="flex items-center space-x-2">
          {player.avatar ? (
            <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full border" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              {player.name[0].toUpperCase()}
            </div>
          )}
          <span className="font-semibold">{player.name} ({player.mark})</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Room: {room}</h1>
        {renderPlayers()}
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i}>
              {renderSquare(i)}
            </div>
          ))}
        </div>
        {game && (
          <div className="mt-4 text-center">
            {game.status === 'playing' ? (
              <p className="text-lg">Next Turn: {game.turn}</p>
            ) : game.status === 'won' ? (
              <p className="text-lg font-semibold text-green-600">
                {game.winner === game.players[0].mark
                  ? game.players[0].name
                  : game.players[1]?.name || 'Player'} wins!
              </p>
            ) : (
              <p className="text-lg font-semibold text-yellow-600">It's a draw!</p>
            )}
          </div>
        )}
        {game && game.status !== 'playing' && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Reset Game
            </button>
          </div>
        )}
        <div className="mt-4 flex justify-center">
            <button 
                onClick={handleLeave}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
                Leave Room
            </button>
        </div>
      </div>
    </div>
  );
};

export default Game;