import { useState } from "react";

interface ScratchCardProps {
  imageUrl: string;
  code: string;
}

const ScratchCards: React.FC<ScratchCardProps> = ({ imageUrl, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="relative w-64 h-64">
      <img
        src={imageUrl}
        alt="Scratch Card"
        className="w-full h-full object-cover rounded-lg"
      />
      <div
        className="absolute bottom-2 left-2 text-neutral-950 font-bold text-lg bg-black bg-opacity-50 px-2 py-1 rounded-[25px] cursor-pointer"
        onClick={handleCopyCode}
      >
        {copied ? (
          <span className="text-green-500">Copied!</span>
        ) : (
          code
        )}
      </div>
    </div>
  );
};

export default ScratchCards;
