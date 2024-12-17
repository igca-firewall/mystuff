"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Position = { x: number; y: number };

const GRID_SIZE = 20;
const SPEED = 150;

export default function SnakeGame1() {
  const [player1, setPlayer1] = useState<Position[]>([{ x: 5, y: 5 }]);
  const [player2, setPlayer2] = useState<Position[]>([{ x: 15, y: 15 }]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });

  const [direction1, setDirection1] = useState<Position>({ x: 0, y: 1 }); // P1 starts moving down
  const [direction2, setDirection2] = useState<Position>({ x: 0, y: -1 }); // P2 starts moving up

  const [isGameOver, setIsGameOver] = useState(false);
  const loopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = () => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    setFood({ x, y });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Player 1 (WASD)
    if (e.key === "w" && direction1.y === 0) setDirection1({ x: 0, y: -1 });
    if (e.key === "s" && direction1.y === 0) setDirection1({ x: 0, y: 1 });
    if (e.key === "a" && direction1.x === 0) setDirection1({ x: -1, y: 0 });
    if (e.key === "d" && direction1.x === 0) setDirection1({ x: 1, y: 0 });

    // Player 2 (Arrow Keys)
    if (e.key === "ArrowUp" && direction2.y === 0) setDirection2({ x: 0, y: -1 });
    if (e.key === "ArrowDown" && direction2.y === 0) setDirection2({ x: 0, y: 1 });
    if (e.key === "ArrowLeft" && direction2.x === 0) setDirection2({ x: -1, y: 0 });
    if (e.key === "ArrowRight" && direction2.x === 0) setDirection2({ x: 1, y: 0 });
  };

  const updateSnake = (
    snake: Position[],
    direction: Position,
    setSnake: React.Dispatch<React.SetStateAction<Position[]>>
  ) => {
    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    // Check collisions
    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= GRID_SIZE ||
      head.y >= GRID_SIZE ||
      newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setIsGameOver(true);
      return snake;
    }

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
      generateFood();
    } else {
      newSnake.pop(); // Remove tail
    }

    newSnake.unshift(head); // Add new head
    return newSnake;
  };

  useEffect(() => {
    if (isGameOver) return;

    loopRef.current = setInterval(() => {
      setPlayer1((prev) => updateSnake(prev, direction1, setPlayer1));
      setPlayer2((prev) => updateSnake(prev, direction2, setPlayer2));
    }, SPEED);

    return () => clearInterval(loopRef.current!);
  }, [direction1, direction2, food, isGameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction1, direction2]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">🐍 Two-Player Snake Game</h1>
      {isGameOver && (
        <div className="text-red-500 text-2xl mb-2 font-bold">Game Over! Press F5 to Restart</div>
      )}
      <div
        className="relative grid grid-cols-[repeat(20,_1fr)] grid-rows-[repeat(20,_1fr)] gap-1 bg-gray-800 p-2"
        style={{ width: "400px", height: "400px" }}
      >
        {/* Render Player 1 */}
        {player1.map((segment, index) => (
          <motion.div
            key={`p1-${index}`}
            className="bg-blue-500 rounded"
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          ></motion.div>
        ))}
        {/* Render Player 2 */}
        {player2.map((segment, index) => (
          <motion.div
            key={`p2-${index}`}
            className="bg-yellow-500 rounded"
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          ></motion.div>
        ))}
        {/* Render Food */}
        <motion.div
          className="bg-red-500 rounded"
          animate={{ scale: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        ></motion.div>
      </div>
      <p className="mt-4 text-lg">
        <span className="text-blue-400">Player 1</span>: WASD |{" "}
        <span className="text-yellow-400">Player 2</span>: Arrow Keys
      </p>
    </div>
  );
}
