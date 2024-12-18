"use client"
import ScratchCards from '@/components/utilities/Scrachcard';
import { fetchScratchCard } from '@/lib/actions/scratchCard.actions';
import { useEffect, useState } from 'react';


const ScratchCardImages = () => {
  const [scratchCards, setScratchCards] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchScratchCard();
      setScratchCards(data);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {scratchCards.map((card, index) => (
        <ScratchCards key={index} imageUrl={"/images/th.jpg"} code={card.code} />
      ))}
    </div>
  );
};
export default ScratchCardImages