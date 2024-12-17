"use client";
import { motion } from "framer-motion";

interface GameCardProps {
  title: string;
  image: string;
}

const GameCard = ({ title, image }: GameCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="rounded-lg overflow-hidden shadow-lg bg-dark"
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-light">{title}</h2>
      </div>
    </motion.div>
  );
};

export default GameCard;
