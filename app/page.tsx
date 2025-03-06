'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Anchor, Ship, Skull } from 'lucide-react';
import PasswordGate from '@/components/PasswordGate';
import PuzzleGame from '@/components/PuzzleGame';
import SuccessPage from '@/components/SuccessPage';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<'password' | 'puzzle' | 'success'>('password');
  const [password] = useState('blackpearl');

  const handlePasswordSuccess = () => {
    setCurrentPage('puzzle');
  };

  const handlePuzzleSuccess = () => {
    setCurrentPage('success');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-8">
          <Skull className="w-12 h-12 text-primary float-animation" />
          <Ship className="w-12 h-12 text-primary float-animation" strokeWidth={1.5} />
          <Anchor className="w-12 h-12 text-primary float-animation" />
        </div>

        {currentPage === 'password' && (
          <PasswordGate password={password} onSuccess={handlePasswordSuccess} />
        )}
        {currentPage === 'puzzle' && (
          <PuzzleGame onSuccess={handlePuzzleSuccess} />
        )}
        {currentPage === 'success' && (
          <SuccessPage />
        )}
      </motion.div>
    </main>
  );
}