import React, { useState, useEffect, useRef } from 'react';

const FlappyBirdGame = ({ onGameOver }) => {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(500);
  const [score, setScore] = useState(0);
  const [obstacleScored, setObstacleScored] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const gameContainerRef = useRef(null);

  const gameWidth = 600;
  const gameHeight = 500;
  const birdSize = 30;
  const gravity = 4;
  const jumpStrength = 70;
  const obstacleWidth = 60;
  const obstacleGap = 200;
  const [obstacleSpeed, setObstacleSpeed] = useState(5);

  useEffect(() => {
    let birdFallTimer;
    if (gameHasStarted) {
      birdFallTimer = setInterval(() => {
        setBirdPosition((prev) => prev + gravity);
      }, 24);
    }
    return () => clearInterval(birdFallTimer);
  }, [gameHasStarted, gravity]);

  useEffect(() => {
    let obstacleMoveTimer;
    if (gameHasStarted) {
      obstacleMoveTimer = setInterval(() => {
        setObstacleLeft((prev) => prev - obstacleSpeed);
      }, 24);
    }
    return () => clearInterval(obstacleMoveTimer);
  }, [gameHasStarted, obstacleSpeed]);

  // Score when bird passes obstacle
  useEffect(() => {
    const birdLeft = gameWidth / 2 - birdSize / 2;
    const obstacleRight = obstacleLeft + obstacleWidth;
    if (
      !obstacleScored &&
      obstacleRight < birdLeft
    ) {
      setScore((prev) => prev + 1);
      setObstacleScored(true);
    }
  }, [obstacleLeft, obstacleScored, gameWidth, birdSize, obstacleWidth]);

  useEffect(() => {
    if (obstacleLeft < -obstacleWidth) {
      setObstacleLeft(gameWidth);
      setObstacleHeight(Math.random() * (gameHeight - obstacleGap - 100) + 50);
      setObstacleScored(false);
      setObstacleSpeed((prev) => Math.min(prev + 0.3, 15));
    }
  }, [obstacleLeft, gameWidth, gameHeight, obstacleGap]);

  useEffect(() => {
    // Collision detection
    const birdBottom = birdPosition + birdSize;
    const birdTop = birdPosition;
    const birdLeft = gameWidth / 2 - birdSize / 2;
    const birdRight = gameWidth / 2 + birdSize / 2;

    const obstacleRight = obstacleLeft + obstacleWidth;
    const obstacleTop = obstacleHeight;
    const obstacleBottom = obstacleHeight + obstacleGap;

    const hasCollidedWithGround = birdBottom >= gameHeight;
    const hasCollidedWithCeiling = birdTop <= 0;

    const hasCollidedWithObstacle = (
      birdRight > obstacleLeft &&
      birdLeft < obstacleRight &&
      (
        birdTop < obstacleTop ||
        birdBottom > obstacleBottom
      )
    );

    if (hasCollidedWithGround || hasCollidedWithCeiling || hasCollidedWithObstacle) {
      setGameHasStarted(false);
      setGameOver(true);
      if (onGameOver) onGameOver(score);
    }
  }, [birdPosition, obstacleLeft, obstacleHeight, score, gameWidth, gameHeight, birdSize, obstacleWidth, obstacleGap]);

  const handleClick = () => {
    if (gameOver) {
      setBirdPosition(250);
      setObstacleLeft(gameWidth);
      setScore(0);
      setObstacleScored(false);
      setObstacleSpeed(5);
      setGameOver(false);
      setGameHasStarted(true);
      return;
    }
    if (!gameHasStarted) {
      setGameHasStarted(true);
    } else {
      setBirdPosition((prev) => Math.max(0, prev - jumpStrength));
    }
  };

  return (
    <div
      ref={gameContainerRef}
      className="relative overflow-hidden border-4 border-green-700"
      style={{
        width: gameWidth,
        height: gameHeight,
        margin: "0 auto",
        cursor: gameHasStarted ? "pointer" : "default",
        background: "linear-gradient(to bottom, #70c1ff 0%, #b2eaff 100%)",
      }}
      onClick={handleClick}
    >
      {/* Ground */}
      <div
        className="absolute left-0"
        style={{
          bottom: 0,
          width: "100%",
          height: 60,
          background: "repeating-linear-gradient(45deg, #ded895, #ded895 10px, #bcae6e 10px, #bcae6e 20px)",
          borderTop: "4px solid #a18c3d",
          zIndex: 2,
        }}
      ></div>
      {/* Bird */}
      <img
        src="https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_Bird_icon.png"
        alt="Flappy Bird"
        className="absolute select-none pointer-events-none"
        style={{
          width: birdSize * 1.2,
          height: birdSize * 1.1,
          top: birdPosition,
          left: gameWidth / 2 - (birdSize * 1.2) / 2,
          transition: gameHasStarted ? "none" : "top 0.1s linear",
          zIndex: 3,
        }}
        draggable={false}
      />
      {/* Pipes */}
      {gameHasStarted && (
        <>
          {/* Top pipe */}
          <div
            className="absolute"
            style={{
              width: obstacleWidth,
              height: obstacleHeight,
              left: obstacleLeft,
              top: 0,
              background: "linear-gradient(to bottom, #7eea5b 80%, #4ecb2c 100%)",
              borderRadius: "20px 20px 40px 40px",
              border: "4px solid #388e1a",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              zIndex: 1,
            }}
          ></div>
          {/* Bottom pipe */}
          <div
            className="absolute"
            style={{
              width: obstacleWidth,
              height: gameHeight - obstacleHeight - obstacleGap,
              left: obstacleLeft,
              top: obstacleHeight + obstacleGap,
              background: "linear-gradient(to bottom, #7eea5b 80%, #4ecb2c 100%)",
              borderRadius: "40px 40px 20px 20px",
              border: "4px solid #388e1a",
              boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
              zIndex: 1,
            }}
          ></div>
        </>
      )}
      {/* Score */}
      <div
        className="absolute top-6 left-1/2"
        style={{
          transform: "translateX(-50%)",
          fontSize: 36,
          fontWeight: "bold",
          color: "#fff",
          textShadow: "2px 2px 0 #000, 0 0 10px #fff",
          letterSpacing: 2,
          zIndex: 10,
        }}
      >
        {score}
      </div>
      {/* Game Over message */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-30">
          <div className="text-white text-4xl font-bold mb-4 drop-shadow-lg">
            Game Over!
          </div>
          <div className="text-white text-2xl font-semibold mb-6 drop-shadow-lg">
            Your score: {score}
          </div>
          <div className="text-white text-xl font-medium bg-accent px-6 py-2 rounded-lg cursor-pointer shadow-lg" style={{marginTop: 8}}>
            Click to Restart
          </div>
        </div>
      )}
      {/* Start message */}
      {!gameHasStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold drop-shadow-lg z-20">
          Click to Start!
        </div>
      )}
    </div>
  );
};

export default FlappyBirdGame;
