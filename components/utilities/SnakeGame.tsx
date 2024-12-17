"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Position = { x: number; y: number };

const GRID_SIZE = 20; // Size of each grid cell
const SPEED = 150; // Snake speed (lower is faster)

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Position>({ x: 0, y: -1 });
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const gameLoop = useRef<NodeJS.Timeout | null>(null);

  // Generate random food position
  const generateFood = () => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    setFood({ x, y });
  };

  // Change direction on key press
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case "ArrowDown":
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case "ArrowLeft":
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case "ArrowRight":
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
    }
  };

  // Main game loop
  useEffect(() => {
    if (isGameOver) return;

    gameLoop.current = setInterval(() => {
      setSnake((prev) => {
        const newSnake = [...prev];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

        // Check collision with walls
        if (head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE) {
          setIsGameOver(true);
          return prev;
        }

        // Check collision with self
        if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setIsGameOver(true);
          return prev;
        }

        newSnake.unshift(head); // Add new head
        if (head.x === food.x && head.y === food.y) {
          generateFood(); // Generate new food
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(gameLoop.current!);
  }, [direction, isGameOver, food]);

  // Add key listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div>
        <h1 className="text-4xl text-center font-bold mb-4">🐍 Snake Game</h1>
        {isGameOver && (
          <div className="text-red-500 text-center text-2xl font-bold">Game Over! Press F5 to Restart</div>
        )}
        <div
          className="relative grid grid-cols-[repeat(20,_1fr)] grid-rows-[repeat(20,_1fr)] gap-1 bg-gray-800 p-2"
          style={{ width: "400px", height: "400px" }}
        >
          {/* Render Snake */}
          {snake.map((segment, index) => (
            <motion.div
              key={index}
              className="bg-green-500 rounded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
              }}
            ></motion.div>
          ))}
          {/* Render Food */}
          <motion.div
            className="bg-red-500 rounded"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
            }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
}
