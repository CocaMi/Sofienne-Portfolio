import React, { useState } from "react";
import FlappyBirdGame from "../../components/FlappyBirdGame.jsx";
import SnakeGame from "../../components/SnakeGame.jsx";
import TetrisGame from "../../components/TetrisGame.jsx";

const Arcade = () => {
  const [activeGame, setActiveGame] = useState(null); // null, 'flappy', 'snake', 'tetris'
  const [flappyHighScore, setFlappyHighScore] = useState(0);
  const [snakeHighScore, setSnakeHighScore] = useState(0);
  const [tetrisHighScore, setTetrisHighScore] = useState(0);
  return (
    <div className='h-full bg-primary/30 py-36 flex items-center justify-center'>
      <div className='container mx-auto text-center'>
        <h1 className='h1'>
          Arcade <span className='text-accent'>Page</span>
        </h1>
        <p className='text-white/60 mb-8'>
          Welcome to the Arcade! here you can play some of our favorite games!
        </p>
{!activeGame ? (
  <div className="flex flex-wrap gap-8 justify-center">
    {/* Flappy Bird */}
    <button
      className="bg-accent hover:bg-accent-hover text-white font-bold flex flex-col items-center justify-center rounded-xl text-xl transition-all duration-300"
      style={{ width: 200, height: 200 }}
      onClick={() => setActiveGame('flappy')}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_Bird_icon.png"
        alt="Flappy Bird Logo"
        style={{ width: 100, height: 100, marginBottom: 16 }}
      />
      Flappy Bird
    </button>
    {/* Snake */}
    <button
      className="bg-green-600 hover:bg-green-700 text-white font-bold flex flex-col items-center justify-center rounded-xl text-xl transition-all duration-300"
      style={{ width: 200, height: 200 }}
      onClick={() => setActiveGame('snake')}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/616/616494.png"
        alt="Snake Icon"
        style={{ width: 90, height: 90, marginBottom: 16 }}
      />
      Snake
    </button>
    {/* Tetris */}
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold flex flex-col items-center justify-center rounded-xl text-xl transition-all duration-300"
      style={{ width: 200, height: 200 }}
      onClick={() => setActiveGame('tetris')}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/424/424062.png"
        alt="Tetris Icon"
        style={{ width: 90, height: 90, marginBottom: 16 }}
      />
      Tetris
    </button>
  </div>
) : (
  <div className="flex flex-col items-center">
    {activeGame === 'flappy' && (
      <FlappyBirdGame
        onGameOver={(score) => {
          setFlappyHighScore((prev) => (score > prev ? score : prev));
        }}
        highestScore={flappyHighScore}
      />
    )}
    {activeGame === 'snake' && (
      <SnakeGame
        onGameOver={(score) => {
          setSnakeHighScore((prev) => (score > prev ? score : prev));
        }}
        highestScore={snakeHighScore}
      />
    )}
    {activeGame === 'tetris' && (
      <TetrisGame
        onGameOver={(score) => {
          setTetrisHighScore((prev) => (score > prev ? score : prev));
        }}
        highestScore={tetrisHighScore}
      />
    )}
    <div className="text-white text-lg font-semibold mt-6 mb-2">
      {activeGame === 'flappy' && `Highest Score: ${flappyHighScore}`}
      {activeGame === 'snake' && `Highest Score: ${snakeHighScore}`}
      {activeGame === 'tetris' && `Highest Score: ${tetrisHighScore}`}
    </div>
    <button
      className="mt-1 bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded"
      onClick={() => setActiveGame(null)}
    >
      Close Game
    </button>
  </div>
)}
      </div>
    </div>
  );
};

export default Arcade;
