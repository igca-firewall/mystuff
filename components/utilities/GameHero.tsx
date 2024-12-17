"use client";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="h-screen relative bg-cover bg-center bg-[url('/images/hero.jpg')]">
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex items-center justify-center h-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-light">
            Welcome to <span className="text-primary">GameZone</span>
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Discover and play the best games with stunning visuals.
          </p>
          <button className="mt-6 px-8 py-3 bg-primary text-white rounded-md hover:bg-pink-700 transition-all">
            Explore Games
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
