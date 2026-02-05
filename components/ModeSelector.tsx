import React, { useState, useRef, useEffect } from 'react';
import { InteractionMode } from '../types';
import { ChevronDown, Smartphone, List, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModeSelectorProps {
  currentMode: InteractionMode;
  onModeChange: (mode: InteractionMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (mode: InteractionMode) => {
    switch (mode) {
      case InteractionMode.TINDER: return <Smartphone size={16} />;
      case InteractionMode.LIST: return <List size={16} />;
      case InteractionMode.CAROUSEL: return <Layout size={16} />;
    }
  };

  return (
    <div ref={ref} className="absolute top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 py-2 rounded-xl text-sm hover:bg-white/20 transition-colors shadow-lg"
      >
        {getIcon(currentMode)}
        <span className="hidden sm:inline font-medium">{currentMode}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-[#1c1c1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
          >
            {Object.values(InteractionMode).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  onModeChange(mode);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                  currentMode === mode ? 'bg-orange-600/20 text-orange-500' : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                 {getIcon(mode)}
                {mode}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModeSelector;
