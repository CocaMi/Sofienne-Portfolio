import React, { useState, useEffect, useRef } from "react";

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;

const SHAPES = [
  // I
  [[1, 1, 1, 1]],
  // O
  [
    [1, 1],
    [1, 1],
  ],
  // T
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  // Z
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  // J
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  // L
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
];

const COLORS = [
  "#00f0f0", // I
  "#f0f000", // O
  "#a000f0", // T
  "#00f000", // S
  "#f00000", // Z
  "#0000f0", // J
  "#f0a000", // L
];

function randomShape() {
  const idx = Math.floor(Math.random() * SHAPES.length);
  return { shape: SHAPES[idx], color: COLORS[idx], idx };
}

function rotate(shape) {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

const TetrisGame = ({ onGameOver }) => {
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [current, setCurrent] = useState({ ...randomShape(), x: 3, y: 0 });
  const [next, setNext] = useState(randomShape());
  const [hold, setHold] = useState(null);
  const [holdUsed, setHoldUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const moveRef = useRef(current);

  useEffect(() => {
    moveRef.current = current;
  }, [current]);

  const boardRef = useRef(null);

  // Soft drop state
  const [softDrop, setSoftDrop] = useState(false);

  useEffect(() => {
    if (gameOver) return;
    const handleKeyDown = (e) => {
      if (gameOver) return;
      if (e.key === "ArrowLeft") move(-1, 0);
      if (e.key === "ArrowRight") move(1, 0);
      if (e.key === "ArrowDown") setSoftDrop(true);
      if (e.key === "ArrowUp") rotateCurrent();
      if (e.key === " ") drop();
      if (e.key === "Shift") holdPiece();
    };
    const handleKeyUp = (e) => {
      if (e.key === "ArrowDown") setSoftDrop(false);
    };
    const ref = boardRef.current;
    if (ref) {
      ref.focus();
      ref.addEventListener("keydown", handleKeyDown);
      ref.addEventListener("keyup", handleKeyUp);
    }
    return () => {
      if (ref) {
        ref.removeEventListener("keydown", handleKeyDown);
        ref.removeEventListener("keyup", handleKeyUp);
      }
    };
    // eslint-disable-next-line
  }, [gameOver, current, board, hold, holdUsed]);

  function holdPiece() {
    if (holdUsed) return;
    setHoldUsed(true);
    if (!hold) {
      setHold({ ...current, x: 0, y: 0 });
      setCurrent({ ...next, x: 3, y: 0 });
      setNext(randomShape());
    } else {
      const temp = hold;
      setHold({ ...current, x: 0, y: 0 });
      setCurrent({ ...temp, x: 3, y: 0 });
    }
  }

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      move(0, softDrop ? 2 : 1);
    }, softDrop ? 40 : 350);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [current, board, gameOver, softDrop]);

  function isValid(shape, x, y) {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (
          shape[r][c] &&
          (
            y + r < 0 ||
            y + r >= ROWS ||
            x + c < 0 ||
            x + c >= COLS ||
            board[y + r][x + c]
          )
        ) {
          return false;
        }
      }
    }
    return true;
  }

  function merge(shape, color, x, y, tempBoard) {
    const newBoard = tempBoard.map(row => [...row]);
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (
          shape[r][c] &&
          y + r >= 0 &&
          y + r < ROWS &&
          x + c >= 0 &&
          x + c < COLS
        ) {
          newBoard[y + r][x + c] = color;
        }
      }
    }
    return newBoard;
  }

  function move(dx, dy) {
    const { shape, color, x, y } = moveRef.current;
    if (isValid(shape, x + dx, y + dy)) {
      setCurrent(cur => ({ ...cur, x: cur.x + dx, y: cur.y + dy }));
    } else if (dy === 1) {
      // Merge and spawn new
      const merged = merge(shape, color, x, y, board);
      // Clear lines
      let lines = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (merged[r].every(cell => cell)) {
          merged.splice(r, 1);
          merged.unshift(Array(COLS).fill(null));
          lines++;
        }
      }
      setScore(s => s + lines * 100);
      setBoard(merged);
      setHoldUsed(false);
      const nextPiece = { ...next, x: 3, y: 0 };
      setNext(randomShape());
      if (!isValid(nextPiece.shape, nextPiece.x, nextPiece.y)) {
        setGameOver(true);
        if (onGameOver) onGameOver(score);
      } else {
        setCurrent(nextPiece);
      }
    }
  }

  function rotateCurrent() {
    const { shape, color, x, y } = moveRef.current;
    const rotated = rotate(shape);
    if (isValid(rotated, x, y)) {
      setCurrent(cur => ({ ...cur, shape: rotated }));
    }
  }

  function drop() {
    let { shape, color, x, y } = moveRef.current;
    while (isValid(shape, x, y + 1)) {
      y++;
    }
    setCurrent(cur => ({ ...cur, y }));
    // After dropping, immediately merge if can't move further
    setTimeout(() => {
      move(0, 1);
    }, 0);
  }

  const handleRestart = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    setCurrent({ ...randomShape(), x: 3, y: 0 });
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-row justify-center items-start">
      {/* Side panel */}
      <div style={{ width: 120, marginRight: 16 }}>
        {/* Next piece */}
        <div className="text-white text-center mb-1">Next</div>
        <div
          style={{
            width: BLOCK_SIZE * 4,
            height: BLOCK_SIZE * 4,
            margin: "0 auto",
            background: "#222",
            borderRadius: 8,
            marginBottom: 16,
            position: "relative",
          }}
        >
          {next.shape.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <div
                  key={`next-${r}-${c}`}
                  style={{
                    width: BLOCK_SIZE - 2,
                    height: BLOCK_SIZE - 2,
                    left: c * BLOCK_SIZE + 1,
                    top: r * BLOCK_SIZE + 1,
                    background: next.color,
                    position: "absolute",
                    borderRadius: 4,
                    border: "1px solid #fff",
                  }}
                ></div>
              ) : null
            )
          )}
        </div>
        {/* Hold piece */}
        <div className="text-white text-center mb-1">Hold</div>
        <div
          style={{
            width: BLOCK_SIZE * 4,
            height: BLOCK_SIZE * 4,
            margin: "0 auto",
            background: "#222",
            borderRadius: 8,
            position: "relative",
          }}
        >
          {hold &&
            hold.shape.map((row, r) =>
              row.map((cell, c) =>
                cell ? (
                  <div
                    key={`hold-${r}-${c}`}
                    style={{
                      width: BLOCK_SIZE - 2,
                      height: BLOCK_SIZE - 2,
                      left: c * BLOCK_SIZE + 1,
                      top: r * BLOCK_SIZE + 1,
                      background: hold.color,
                      position: "absolute",
                      borderRadius: 4,
                      border: "1px solid #fff",
                    }}
                  ></div>
                ) : null
              )
            )}
        </div>
      </div>
      {/* Main board */}
      <div
        tabIndex={0}
        ref={boardRef}
        className="relative bg-black border-4 border-blue-700 mx-auto outline-none"
        style={{
          width: COLS * BLOCK_SIZE,
          height: ROWS * BLOCK_SIZE,
        }}
        onClick={() => boardRef.current && boardRef.current.focus()}
      >
        {/* Board */}
        {board.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <div
                key={r + "-" + c}
                className="absolute"
                style={{
                  width: BLOCK_SIZE - 2,
                  height: BLOCK_SIZE - 2,
                  left: c * BLOCK_SIZE + 1,
                  top: r * BLOCK_SIZE + 1,
                  background: cell,
                  borderRadius: 4,
                  border: "1px solid #222",
                }}
              ></div>
            ) : null
          )
        )}
        {/* Shadow (landing position) */}
        {(() => {
          // Calculate shadow y
          let shadowY = current.y;
          while (
            isValid(current.shape, current.x, shadowY + 1)
          ) {
            shadowY++;
          }
          return current.shape.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <div
                  key={`shadow-${r}-${c}`}
                  className="absolute"
                  style={{
                    width: BLOCK_SIZE - 2,
                    height: BLOCK_SIZE - 2,
                    left: (current.x + c) * BLOCK_SIZE + 1,
                    top: (shadowY + r) * BLOCK_SIZE + 1,
                    background: current.color,
                    opacity: 0.25,
                    borderRadius: 4,
                    border: "1px dashed #fff",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                ></div>
              ) : null
            )
          );
        })()}
        {/* Current piece */}
        {current.shape.map((row, r) =>
          row.map((cell, c) =>
            cell ? (
              <div
                key={r + "-" + c}
                className="absolute"
                style={{
                  width: BLOCK_SIZE - 2,
                  height: BLOCK_SIZE - 2,
                  left: (current.x + c) * BLOCK_SIZE + 1,
                  top: (current.y + r) * BLOCK_SIZE + 1,
                  background: current.color,
                  borderRadius: 4,
                  border: "1px solid #222",
                  zIndex: 2,
                }}
              ></div>
            ) : null
          )
        )}
        {/* Score */}
        <div className="absolute top-2 left-2 text-white font-bold text-lg z-10">
          Score: {score}
        </div>
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
    </div>
  );
};

export default TetrisGame;
