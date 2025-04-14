import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [typedTitle, setTypedTitle] = useState('');
  const fullTitle = 'Secure Certificate Validation';

  useEffect(() => {
    let timeout;
    if (typedTitle.length < fullTitle.length) {
      timeout = setTimeout(() => {
        setTypedTitle(fullTitle.slice(0, typedTitle.length + 1));
      }, 100);
    }
    return () => clearTimeout(timeout);
  }, [typedTitle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white overflow-hidden pt-20">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob max-md:hidden"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 max-md:hidden"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        {/* Animated Typing Title */}
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight 
          bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300"
        >
          {typedTitle}
          <span className="animate-pulse">|</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-base md:text-xl mb-12 max-w-2xl mx-auto text-gray-200"
        >
          Blockchain-Powered Certificate Verification & Validation Platform
        </motion.p>

        {/* Tech Stack Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-4 md:space-x-8 mb-16"
        >
          {[
            { icon: Shield, name: 'Secure Verification' },
            { icon: Database, name: 'Blockchain Storage' },
            { icon: Globe, name: 'Decentralized' },
            { icon: Lock, name: 'Immutable Records' }
          ].map(({ icon: Icon, name }, index) => (
            <div 
              key={name} 
              className="text-center w-20 md:w-auto transform transition hover:scale-110 hover:rotate-6"
            >
              <div className="bg-white/10 p-3 md:p-4 rounded-full shadow-lg backdrop-blur-sm">
                <Icon className="w-8 h-8 md:w-12 md:h-12 mx-auto text-white" />
              </div>
              <p className="mt-2 text-xs md:text-sm">{name}</p>
            </div>
          ))}
        </motion.div>

        {/* Call to Action Button */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="w-full max-w-xs"
        >
          <button className="w-full bg-blue-600 hover:bg-blue-700 
            px-8 py-3 rounded-full font-semibold transition-all 
            hover:shadow-xl hover:scale-105">
            <Link to={"/ngo"}>Get Started</Link>
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white/50 text-sm">
        Powered by React.js | Solidity | Node.js | MongoDB
      </div>
    </div>
  );
};

export default HomePage;