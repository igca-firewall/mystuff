"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import MarketBanner from "@/components/utilities/Banner";
import FeaturedProducts from "@/components/utilities/FeaturedProducts";
import FAQ from "@/components/utilities/FAQ";
import Testimoni from "@/components/utilities/Testimoni";
import HowItWorks from "@/components/utilities/HowItWorks";
import Contact from "@/components/utilities/Contact";
import Game from "@/components/utilities/Game";
import MemoryGame from "@/components/utilities/Games";
import SnakeGame from "@/components/utilities/SnakeGame";
import SnakeGame1 from "@/components/utilities/TwoSnakes";
import Ping from "@/components/utilities/Ping";

const Marketplace = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleCardSelection = (card: number) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
{/* <Game/> */}
{/* <MemoryGame/>
<SnakeGame/>
<SnakeGame1/>
<Ping/> */}
      {/* Hero Section */}
      <MarketBanner />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Customer Testimonials Section */}
      <Testimoni />
      {/* FAQs Section */}
      <FAQ />
      {/* Contact*/}
      <Contact />
    </div>
  );
};

export default Marketplace;
