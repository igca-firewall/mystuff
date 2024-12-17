"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { FiArrowDownCircle } from "react-icons/fi";
import Image from "next/image";

// Dynamic particles animation
const ParticlesBg = dynamic(() => import("react-tsparticles"), { ssr: false });

// Animation Variants
const welcomeAnimation = {
  initial: { scale: 0.2, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 1.5, ease: "easeOut" } },
  exit: { scale: 5, opacity: 0, transition: { duration: 1, ease: "easeInOut" } },
};

const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative bg-black text-white min-h-screen overflow-hidden">
      {/* Background Particles */}
      <ParticlesBg
        id="tsparticles"
        options={{
          background: { color: "#000" },
          particles: {
            number: { value: 100 },
            size: { value: 2 },
            color: { value: "#ffffff" },
            move: { enable: true, speed: 2 },
            links: { enable: true, distance: 150, color: "#fff", opacity: 0.4 },
          },
          fpsLimit: 60,
        }}
      />

      {/* Welcome Screen */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50"
            variants={welcomeAnimation}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold text-white text-center leading-snug"
              whileHover={{ scale: 1.05 }}
            >
              Welcome to <span className="text-primary">GameZone</span>
            </motion.h1>
            <motion.div
              className="mt-6 text-gray-300 text-lg flex items-center gap-2 animate-bounce"
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FiArrowDownCircle size={36} />
              Enter the Game
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {!showWelcome && (
        <>
          {/* Hero Section */}
          <section className="relative flex items-center justify-center h-screen bg-[url('/images/hero.jpg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/70" />
            <motion.div
              className="relative text-center px-4"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
                Discover <span className="text-primary">Legendary Games</span>
              </h1>
              <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
                Explore epic battles, infinite thrills, and legendary adventures.
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="mt-8 px-6 py-3 bg-primary text-white font-semibold rounded-md shadow-lg hover:shadow-2xl transition-transform duration-300"
              >
                Start Playing
              </motion.button>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="bg-black py-6 text-center absolute bottom-0 w-full">
            <p className="text-gray-500 text-sm">&copy; 2024 GameZone. All rights reserved.</p>
          </footer>
        </>
      )}
    </main>
  );
}
