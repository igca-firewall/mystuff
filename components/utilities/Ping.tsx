"use client";
import React, { useState, useEffect, useRef } from "react";

const WIDTH = 800;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 10;
const BALL_SPEED = 5;

const Ping = () => {
  const [ball, setBall] = useState({ x: WIDTH / 2, y: HEIGHT / 2, dx: BALL_SPEED, dy: BALL_SPEED });
  const [paddle1, setPaddle1] = useState({ y: HEIGHT / 2 - PADDLE_HEIGHT / 2 });
  const [paddle2, setPaddle2] = useState({ y: HEIGHT / 2 - PADDLE_HEIGHT / 2 });
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const paddle1Ref = useRef<HTMLDivElement | null>(null);
  const paddle2Ref = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<any>(null);

  // Controls movement
  const movePaddle1 = (e: KeyboardEvent) => {
    if (e.key === "w" && paddle1.y > 0) {
      setPaddle1((prev) => ({ y: prev.y - PADDLE_SPEED }));
    } else if (e.key === "s" && paddle1.y < HEIGHT - PADDLE_HEIGHT) {
      setPaddle1((prev) => ({ y: prev.y + PADDLE_SPEED }));
    }
  };

  const movePaddle2 = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" && paddle2.y > 0) {
      setPaddle2((prev) => ({ y: prev.y - PADDLE_SPEED }));
    } else if (e.key === "ArrowDown" && paddle2.y < HEIGHT - PADDLE_HEIGHT) {
      setPaddle2((prev) => ({ y: prev.y + PADDLE_SPEED }));
    }
  };

  // Ball movement and game logic
  useEffect(() => {
    const updateGame = () => {
      setBall((prevBall) => {
        const newBall = { ...prevBall };

        // Ball hits top or bottom
        if (newBall.y <= 0 || newBall.y >= HEIGHT - BALL_SIZE) {
          newBall.dy = -newBall.dy;
        }

        // Ball hits paddle1 (Player 1)
        if (
          newBall.x <= PADDLE_WIDTH &&
          newBall.y >= paddle1.y &&
          newBall.y <= paddle1.y + PADDLE_HEIGHT
        ) {
          newBall.dx = -newBall.dx;
        }

        // Ball hits paddle2 (Player 2)
        if (
          newBall.x >= WIDTH - PADDLE_WIDTH - BALL_SIZE &&
          newBall.y >= paddle2.y &&
          newBall.y <= paddle2.y + PADDLE_HEIGHT
        ) {
          newBall.dx = -newBall.dx;
        }

        // Ball goes out of bounds (Player scores)
        if (newBall.x <= 0) {
          setScore2((prev) => prev + 1);
          newBall.x = WIDTH / 2;
          newBall.y = HEIGHT / 2;
        }
        if (newBall.x >= WIDTH - BALL_SIZE) {
          setScore1((prev) => prev + 1);
          newBall.x = WIDTH / 2;
          newBall.y = HEIGHT / 2;
        }

        // Move the ball
        newBall.x += newBall.dx;
        newBall.y += newBall.dy;

        return newBall;
      });
    };

    intervalRef.current = setInterval(updateGame, 1000 / 60);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [ball, paddle1, paddle2]);

  useEffect(() => {
    window.addEventListener("keydown", movePaddle1);
    window.addEventListener("keydown", movePaddle2);

    return () => {
      window.removeEventListener("keydown", movePaddle1);
      window.removeEventListener("keydown", movePaddle2);
    };
  }, [paddle1, paddle2]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Pong Game</h1>
      <div className="relative" style={{ width: WIDTH, height: HEIGHT, backgroundColor: "#333" }}>
        {/* Player 1 Paddle */}
        <div
          ref={paddle1Ref}
          style={{
            position: "absolute",
            top: paddle1.y,
            left: 0,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            backgroundColor: "blue",
          }}
        ></div>

        {/* Player 2 Paddle */}
        <div
          ref={paddle2Ref}
          style={{
            position: "absolute",
            top: paddle2.y,
            right: 0,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            backgroundColor: "red",
          }}
        ></div>

        {/* Ball */}
        <div
          ref={ballRef}
          style={{
            position: "absolute",
            top: ball.y,
            left: ball.x,
            width: BALL_SIZE,
            height: BALL_SIZE,
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        ></div>
      </div>

      {/* Score */}
      <div className="text-xl mt-4">
        <span>Player 1: {score1}</span> | <span>Player 2: {score2}</span>
      </div>
    </div>
  );
};

export default Ping;
