"use client";
import { motion } from "framer-motion";

const GameFooter = () => {
  return (
    <motion.footer
      className="bg-dark text-light p-6 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <p>&copy; 2024 GameZone. All rights reserved.</p>
    </motion.footer>
  );
};

export default GameFooter;
