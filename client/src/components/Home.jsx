import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [room, setRoom] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (room.trim() === '' || name.trim() === '') return;
    const encodedAvatar = encodeURIComponent(avatar);
    navigate(`/game?room=${room}&name=${name}&avatar=${encodedAvatar}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Join a Game</h1>
        <input
          type="text"
          placeholder="Room Name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="border rounded p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Avatar URL (optional)"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          className="border rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleJoin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Join Game
        </button>
      </div>
    </div>
  );
};

export default Home;