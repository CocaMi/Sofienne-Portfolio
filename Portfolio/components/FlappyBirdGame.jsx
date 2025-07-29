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

  // Responsive game size
  const baseWidth = 600;
  const baseHeight = 500;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const gameWidth = isMobile ? Math.min(window.innerWidth * 0.98, 360) : baseWidth;
  const gameHeight = isMobile ? Math.min(window.innerHeight * 0.6, 420) : baseHeight;
  const scaleX = gameWidth / baseWidth;
  const scaleY = gameHeight / baseHeight;
  const scale = Math.min(scaleX, scaleY);

  const birdSize = 30 * scale;
  const gravity = 4 * scale;
  const jumpStrength = 70 * scale;
  const obstacleWidth = 60 * scale;
  const obstacleGap = 200 * scale;
  const groundHeight = 60 * scale;
  const [obstacleSpeed, setObstacleSpeed] = useState(5 * scale);

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
      setObstacleHeight(Math.random() * (gameHeight - obstacleGap - 100 * scale) + 50 * scale);
      setObstacleScored(false);
      setObstacleSpeed((prev) => Math.min(prev + 0.3 * scale, 15 * scale));
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
      setObstacleSpeed(5 * scale);
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
        width: "98vw",
        maxWidth: 600,
        height: gameHeight,
        maxHeight: 500,
        margin: "0 auto",
        cursor: gameHasStarted ? "pointer" : "default",
        background: "linear-gradient(to bottom, #70c1ff 0%, #b2eaff 100%)",
        touchAction: "manipulation",
      }}
      onClick={handleClick}
    >
      {/* Ground */}
      <div
        className="absolute left-0"
        style={{
          bottom: 0,
          width: "100%",
          height: groundHeight,
          background: "repeating-linear-gradient(45deg, #ded895, #ded895 10px, #bcae6e 10px, #bcae6e 20px)",
          borderTop: `${4 * scale}px solid #a18c3d`,
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
              borderRadius: `${20 * scale}px ${20 * scale}px ${40 * scale}px ${40 * scale}px`,
              border: `${4 * scale}px solid #388e1a`,
              boxShadow: `0 ${4 * scale}px ${8 * scale}px rgba(0,0,0,0.15)`,
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
              borderRadius: `${40 * scale}px ${40 * scale}px ${20 * scale}px ${20 * scale}px`,
              border: `${4 * scale}px solid #388e1a`,
              boxShadow: `0 ${4 * scale}px ${8 * scale}px rgba(0,0,0,0.15)`,
              zIndex: 1,
            }}
          ></div>
        </>
      )}
      {/* Score */}
      <div
        className="absolute"
        style={{
          top: 6 * scale,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 36 * scale,
          fontWeight: "bold",
          color: "#fff",
          textShadow: `2px 2px 0 #000, 0 0 ${10 * scale}px #fff`,
          letterSpacing: 2 * scale,
          zIndex: 10,
        }}
      >
        {score}
      </div>
      {/* Game Over message */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-30">
          <div className="text-white text-4xl font-bold mb-4 drop-shadow-lg" style={{fontSize: 32 * scale}}>
            Game Over!
          </div>
          <div className="text-white text-2xl font-semibold mb-6 drop-shadow-lg" style={{fontSize: 22 * scale}}>
            Your score: {score}
          </div>
          <div className="text-white text-xl font-medium bg-accent px-6 py-2 rounded-lg cursor-pointer shadow-lg" style={{marginTop: 8 * scale, fontSize: 18 * scale}}>
            Click to Restart
          </div>
        </div>
      )}
      {/* Start message */}
      {!gameHasStarted && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold drop-shadow-lg z-20" style={{fontSize: 24 * scale}}>
          Click to Start!
        </div>
      )}
    </div>
  );
};

export default FlappyBirdGame;
