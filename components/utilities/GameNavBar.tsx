"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      className="fixed w-full top-0 z-50 bg-dark text-light shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-primary">GameZone</h1>

        {/* Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="#" className="hover:text-primary">Home</Link>
          <Link href="#" className="hover:text-primary">Games</Link>
          <Link href="#" className="hover:text-primary">About</Link>
          <Link href="#" className="hover:text-primary">Contact</Link>
        </div>

        {/* Mobile Menu */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="md:hidden bg-dark"
        >
          <Link href="#" className="block py-2 px-4 hover:text-primary">Home</Link>
          <Link href="#" className="block py-2 px-4 hover:text-primary">Games</Link>
          <Link href="#" className="block py-2 px-4 hover:text-primary">About</Link>
          <Link href="#" className="block py-2 px-4 hover:text-primary">Contact</Link>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
