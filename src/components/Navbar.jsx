import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Admin Panel", path: "/admin" },
    { name: "NGO Dashboard", path: "/ngo" },
    { name: "Verifier Dashboard", path: "/verifier" }
  ];

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      y: "-100%",
      transition: {
        duration: 0.3
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-br from-indigo-900/80 via-purple-800/80 to-pink-700/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight 
            bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">
            CertiChain
          </h1>
        </motion.div>
        
        {/* Mobile Menu Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
        
        {/* Desktop Navigation */}
        <motion.ul 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex space-x-6 items-center text-base font-medium"
        >
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className="text-white/90 hover:text-white 
                  transition duration-300 ease-in-out 
                  hover:underline hover:underline-offset-4 
                  decoration-blue-300"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </motion.ul>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="md:hidden absolute w-full bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 shadow-lg"
          >
            <ul className="px-4 py-6 space-y-4 text-center">
              {navLinks.map((link) => (
                <motion.li 
                  key={link.path}
                  variants={linkVariants}
                >
                  <Link
                    to={link.path}
                    className="block text-white/90 hover:text-white 
                      text-xl font-semibold py-2 
                      hover:bg-white/10 rounded-lg 
                      transition duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;