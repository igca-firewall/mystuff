"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
 import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const slides = [
  {
    lightImage: "/images/ticket gray white.png",
    darkImage: "/images/ticket gray dark.png",
    heading: "Standard Ticket.",
    textShort: "The Standard Ticket offers access to tournaments of $2 or less. Ideal for beginners or cautious bettors, it balances affordability and opportunity.",
    textLong: "The Standard Ticket is your entry into our Tournament, offering access to tournaments of $2 or less. Perfect for beginners or those who prefer a cautious approach, this ticket provides a balance of affordability and opportunity, allowing you to explore our MarketPlace while managing your risk effectively.",
    buttonText: "Buy Now",
    price: "$1"
  },
  {
    lightImage: "/images/ticket green white.png",
    darkImage: "/images/ticket green dark.png",
    heading: "Emerald Classic Ticket.",
    textShort: "Step up with the Emerald Classic Ticket, granting access to tournaments of $4 or less. Perfect for enhancing your betting experience.",
    textLong: "Step up your game with the Emerald Classic Ticket, granting access to tournaments of $4 or less. Ideal for those ready to enhance their betting experience, this ticket offers a range of options within our MarketPlace, allowing you to explore diverse possibilities while keeping tournaments at a reasonable level.",
    buttonText: "Buy Now",
    price: "$2"
  },
  {
    lightImage: "/images/ticket blue white.png",
    darkImage: "/images/ticket blue dark.png",
    heading: "Sapphire Premium Ticket.",
    textShort: "Unlock premium betting with the Sapphire Premium Ticket, allowing tournaments of up to $25. Perfect for those seeking exclusivity.",
    textLong: "Unlock premium betting with the Sapphire Premium Ticket, allowing tournaments of up to $25. Perfect for those with a taste for exclusivity, this ticket provides access to a carefully curated selection of premium items and opportunities, designed for those ready to make a substantial investment in their betting strategy.",
    buttonText: "Buy Now",
    price: "$8"
  },
  {
    lightImage: "/images/ticket pink white.png",
    darkImage: "/images/ticket pink dark.png",
    heading: "Rose Gold Elite Ticket.",
    textShort: "Elevate your experience with the Rose Gold Elite Ticket, offering access to tournaments of $16 or less. Designed for luxury and exclusivity.",
    textLong: "Elevate your experience with the Rose Gold Elite Ticket, offering access to tournaments of $16 or less. Designed for those seeking luxury and exclusivity, this ticket provides access to a curated selection of items that reflect sophisticated taste, ensuring a betting experience that stands out from the ordinary.",
    buttonText: "Buy Now",
    price: "$10"
  },
  {
    lightImage: "/images/ticket red white.png",
    darkImage: "/images/ticket red.png",
    heading: "Ruby Prestige Ticket.",
    textShort: "Make your mark with the Ruby Prestige Ticket, granting access to tournaments of $50 or less. Ideal for unparalleled quality and distinction.",
    textLong: "Make your mark with the Ruby Prestige Ticket, granting access to tournaments of $50 or less. Ideal for those who desire unparalleled quality and distinction, this ticket offers access to our most prestigious items, ensuring a betting experience that reflects the highest standards of excellence.",
    buttonText: "Buy Now",
    price: "$15"
  },
  {
    lightImage: "/images/ticket purple white.png",
    darkImage: "/images/ticket purple dark.png",
    heading: "Amethyst Signature Ticket.",
    textShort: "Experience exclusivity with the Amethyst Signature Ticket, providing access to tournaments of $100 or less. Reserved for unique taste.",
    textLong: "Experience exclusivity with the Amethyst Signature Ticket, providing access to tournaments of $100 or less. Reserved for those who appreciate uniqueness, this ticket offers access to signature pieces within our MarketPlace, ensuring a betting experience as distinctive as your taste.",
    buttonText: "Buy Now",
    price: "$25"
  },
];
const MarketBanner = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [ theme, setTheme ] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: false, // Re-trigger animations when re-entering the viewport
    threshold: 0.2, // Trigger when 20% of the element is visible
  });

  const controls = useAnimation();

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    }
    setLoading(false);
  }, [setTheme]);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? slides.length - 1 : prevIndex + 1
    );
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (loading) {
    return (
      <div className="relative flex flex-col w-full h-[350px] md:h-[450px] xl:h-[500px] rounded-[25px] bg-neutral-300 dark:bg-neutral-800 px-4 py-3">
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-300">
          <div className="w-16 h-16 border-4 border-t-4 border-orange-500 rounded-full animate-spin"></div>
          <p className="ml-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
       {...handlers}
       ref={ref}
      className="relative flex flex-col w-full h-[350px] md:h-[450px] xl:h-[500px] rounded-[25px] bg-neutral-200 dark:bg-neutral-800 p-4 overflow-hidden"
    >
      <div className="absolute top-4 right-4 text-sm bg-opacity-25 dark:bg-neutral-700 px-2 rounded-full bg-white/80 text-center font-regular text-neutral-600 dark:text-neutral-200">
        {slides[currentIndex]?.price}
      </div>

      <div className="flex gap-4 w-full h-full">
        {/* Image Section */}
        <motion.div
          className="relative w-[200px] md:w-[250px] xl:w-[300px] h-full"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
      
        >
          <Image
            src={
              theme === "dark"
                ? slides[currentIndex]?.darkImage
                : slides[currentIndex]?.lightImage
            }
            alt={`Slide ${currentIndex + 1}`}
            layout="fill"
            objectFit="cover"
            className="rounded-[25px] shadow-lg"
            quality={100}
            priority
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          className="flex flex-col justify-center flex-1"
          initial={{ opacity: 0, x: 50 }}
        animate={controls} 
        //  animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4 }}
             variants={containerVariants}
        >
          <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
            {slides[currentIndex]?.heading}
          </h2>
          <p className="text-xs md:text-sm xl:text-base text-neutral-600 dark:text-neutral-400 mb-3">
            <span className="hidden lg:block">{slides[currentIndex]?.textLong}</span>
            <span className="block lg:hidden">{slides[currentIndex]?.textShort}</span>
          </p>
          <Button
            onClick={handleFlip}
            className="bg-orange-500 text-white rounded-[15px] font-bold hover:bg-orange-600 transition-colors duration-300 w-24"
          >
            {slides[currentIndex]?.buttonText}
          </Button>
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 flex space-x-2">
        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              index === currentIndex
                ? "bg-neutral-700 dark:bg-neutral-300"
                : "bg-neutral-500 dark:bg-neutral-200 opacity-40"
            }`}
            onClick={() => handleDotClick(index)}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-2">
        <motion.div
          className={`w-7 h-7 flex items-center justify-center rounded-full shadow-lg cursor-pointer ${
            currentIndex === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white/80 text-neutral-900 hover:bg-white"
          }`}
          onClick={handlePrev}
          whileTap={{ scale: 0.9 }}
        >
          &#8249;
        </motion.div>
        <motion.div
          className={`w-7 h-7 flex items-center justify-center rounded-full shadow-lg cursor-pointer ${
            currentIndex === slides.length - 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white/80 text-neutral-900 hover:bg-white"
          }`}
          onClick={handleNext}
          whileTap={{ scale: 0.9 }}
        >
          &#8250;
        </motion.div>
      </div>
    </div>
  );
};

export default MarketBanner;
