"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Utility to shuffle cards
const shuffleArray = <T,>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

// Card interface
interface CardItem {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const initialCards = ["🐱", "🐶", "🐸", "🐼", "🦄", "🐧", "🐱", "🐶", "🐸", "🐼", "🦄", "🐧"];
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);

  useEffect(() => {
    // Initialize cards
    const shuffled = shuffleArray(initialCards);
    setCards(
      shuffled.map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }))
    );
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlippedCards((prev) => [...prev, index]);

    if (flippedCards.length === 1) {
      const firstIndex = flippedCards[0];
      if (newCards[firstIndex].value === newCards[index].value) {
        // Match found
        newCards[firstIndex].isMatched = true;
        newCards[index].isMatched = true;
        setMatchedPairs((prev) => prev + 1);
      } else {
        // Flip back after delay
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false;
          newCards[index].isFlipped = false;
          setCards([...newCards]);
        }, 1000);
      }
      setFlippedCards([]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Memory Match Game</h1>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="w-20 h-28 bg-gray-800 rounded-lg flex items-center justify-center text-2xl font-bold shadow-lg cursor-pointer"
            animate={{
              rotateY: card.isFlipped || card.isMatched ? 0 : 180,
            }}
            transition={{ duration: 0.5 }}
            onClick={() => handleCardClick(index)}
          >
            <div className="text-white">
              {card.isFlipped || card.isMatched ? card.value : "?"}
            </div>
          </motion.div>
        ))}
      </div>
      {matchedPairs === initialCards.length / 2 && (
        <div className="mt-6 text-2xl font-bold text-green-400">You Win! 🎉</div>
      )}
    </main>
  );
}
