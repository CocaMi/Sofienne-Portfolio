import React, { useState, useEffect, useRef } from "react";

const gridSize = 20;
const tileCount = 20;
const initialSnake = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];
const initialDirection = { x: 1, y: 0 };

function getRandomFood(snake) {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
    if (!snake.some((s) => s.x === newFood.x && s.y === newFood.y)) break;
  }
  return newFood;
}

const SnakeGame = ({ onGameOver, highestScore }) => {
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState(initialDirection);
  const [food, setFood] = useState(getRandomFood(initialSnake));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const moveRef = useRef(direction);

  useEffect(() => {
    moveRef.current = direction;
  }, [direction]);

  const boardRef = useRef(null);

  useEffect(() => {
    if (gameOver) return;
    const handleKey = (e) => {
      if (e.key === "ArrowUp" && moveRef.current.y !== 1) setDirection({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && moveRef.current.y !== -1) setDirection({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && moveRef.current.x !== 1) setDirection({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && moveRef.current.x !== -1) setDirection({ x: 1, y: 0 });
    };
    const ref = boardRef.current;
    if (ref) {
      ref.focus();
      ref.addEventListener("keydown", handleKey);
    }
    return () => {
      if (ref) ref.removeEventListener("keydown", handleKey);
    };
  }, [gameOver]);

  // Move snake logic extracted for reuse
  const moveSnake = (dir = direction) => {
    setSnake((prev) => {
      const newHead = {
        x: prev[0].x + dir.x,
        y: prev[0].y + dir.y,
      };
      // Check collision
      if (
        newHead.x < 0 ||
        newHead.x >= tileCount ||
        newHead.y < 0 ||
        newHead.y >= tileCount ||
        prev.some((s) => s.x === newHead.x && s.y === newHead.y)
      ) {
        setGameOver(true);
        if (onGameOver) onGameOver(score);
        return prev;
      }
      let newSnake = [newHead, ...prev];
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(getRandomFood(newSnake));
        setScore((s) => s + 1);
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  };

  // Regular interval movement
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      moveSnake();
    }, 110);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, onGameOver, score]);

  // Move instantly on direction change
  useEffect(() => {
    if (gameOver) return;
    moveSnake(direction);
    // eslint-disable-next-line
  }, [direction]);

  const handleRestart = () => {
    setSnake(initialSnake);
    setDirection(initialDirection);
    setFood(getRandomFood(initialSnake));
    setScore(0);
    setGameOver(false);
  };

  return (
    <div
      tabIndex={0}
      ref={boardRef}
      className="relative bg-black border-4 border-green-700 mx-auto outline-none"
      style={{
        width: gridSize * tileCount,
        height: gridSize * tileCount,
      }}
      onClick={() => boardRef.current && boardRef.current.focus()}
    >
      {/* Food */}
      <div
        className="absolute bg-red-500 rounded"
        style={{
          width: gridSize - 2,
          height: gridSize - 2,
          left: food.x * gridSize + 1,
          top: food.y * gridSize + 1,
        }}
      ></div>
      {/* Snake */}
      {snake.map((s, i) => (
        <div
          key={i}
          className="absolute bg-green-400 rounded"
          style={{
            width: gridSize - 2,
            height: gridSize - 2,
            left: s.x * gridSize + 1,
            top: s.y * gridSize + 1,
            zIndex: 2,
            border: i === 0 ? "2px solid #fff" : undefined,
          }}
        ></div>
      ))}
      {/* Score */}
      <div className="absolute top-2 left-2 text-white font-bold text-lg z-10">
        Score: {score}
      </div>
      {/* Highest Score */}
      {typeof highestScore === "number" && (
        <div className="absolute top-2 right-2 text-yellow-300 font-bold text-lg z-10">
          Highest: {highestScore}
        </div>
      )}
      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-20">
          <div className="text-white text-3xl font-bold mb-2">Game Over!</div>
          <div className="text-white text-xl mb-4">Score: {score}</div>
          <button
            className="bg-accent text-white px-6 py-2 rounded font-semibold"
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
