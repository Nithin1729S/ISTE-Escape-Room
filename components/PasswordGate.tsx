'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Lock } from 'lucide-react';

interface PasswordGateProps {
  password: string;
  onSuccess: () => void;
}

export default function PasswordGate({ password, onSuccess }: PasswordGateProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.toLowerCase() === password.toLowerCase()) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-md p-8 rounded-lg bg-card/80 backdrop-blur shadow-xl border border-primary/20"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: error ? [0, -10, 10, -10, 10, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          <Lock className="w-16 h-16 mx-auto mb-4 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-bold text-primary mb-2">Pirate&apos;s Gate</h1>
        <p className="text-muted-foreground">Speak the secret word to enter, ye scurvy dog!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full px-4 py-3 bg-background/50 rounded-lg border-2 focus:outline-none transition-colors ${
              error ? 'border-destructive' : 'border-primary/20 focus:border-primary'
            }`}
            placeholder="Enter the secret password..."
          />
          <Key className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50" size={20} />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold 
                   shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-shadow"
        >
          Unlock the Gate
        </motion.button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Hint: The name of Jack Sparrow&apos;s beloved ship
        </p>
      </form>
    </motion.div>
  );
}