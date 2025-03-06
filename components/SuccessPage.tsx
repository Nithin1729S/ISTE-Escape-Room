'use client';

import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

export default function SuccessPage() {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-md p-8 rounded-lg bg-card/80 backdrop-blur shadow-xl border border-primary/20 text-center"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mb-6"
      >
        <Trophy className="w-16 h-16 mx-auto text-primary" />
      </motion.div>

      <h1 className="text-3xl font-bold text-primary mb-4">
        Treasure Found!
      </h1>

      <p className="text-xl text-muted-foreground mb-6">
        Ye&apos;ve proven yerself worthy of the pirate&apos;s treasure!
      </p>

      <div className="flex justify-center gap-4">
        <Sparkles className="w-6 h-6 text-primary animate-bounce" />
        <Sparkles className="w-6 h-6 text-primary animate-bounce delay-100" />
        <Sparkles className="w-6 h-6 text-primary animate-bounce delay-200" />
      </div>
    </motion.div>
  );
}