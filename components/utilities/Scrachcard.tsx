import { useState } from "react";
import { motion } from "framer-motion";

interface ScratchCardProps {
  frontImageUrl: string;  // Front image URL
  backImageUrl: string;   // Back image URL
  code: string;
}

const ScratchCards: React.FC<ScratchCardProps> = ({ frontImageUrl, backImageUrl, code }) => {
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  const handleCardClick = () => {
    setFlipped((prev) => !prev); // Toggle flipped state on click
  };

  return (
    <motion.div
      className="relative w-full sm:w-80 h-80 cursor-pointer rounded-lg shadow-lg overflow-hidden transition-transform duration-500 hover:scale-105"
      onClick={handleCardClick}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: flipped ? 180 : 0 }}  // Flip the card
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      aria-label="Scratch card"
    >
      {/* Front Side */}
      <motion.div
        className="absolute w-full h-full backface-hidden"
        style={{
          backgroundImage: `url(${frontImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(70%)", // Optional: adds a subtle dark overlay for better contrast
        }}
      ></motion.div>

      {/* Back Side */}
      <motion.div
        className="absolute w-full h-full bg-black bg-opacity-70 text-white flex items-center justify-center backface-hidden"
        style={{
          transform: "rotateY(180deg)",  // Keep it rotated to the back until the flip
          backgroundImage: `url(${backImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center space-y-4">
          <div
            className="text-2xl sm:text-3xl font-bold cursor-pointer"
            onClick={handleCopyCode}
            aria-label="Copy code"
          >
            {copied ? (
              <span className="text-green-500">Copied!</span>
            ) : (
              code
            )}
          </div>
          <div
            className="text-sm text-gray-300"
            style={{ opacity: copied ? 0.7 : 1 }}
          >
            Click to copy the code
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScratchCards;
