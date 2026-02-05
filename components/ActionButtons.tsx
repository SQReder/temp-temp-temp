import React from 'react';
import { X, Heart, AlertTriangle } from 'lucide-react';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onPass, onLike }) => {
  return (
    <div className="flex items-center gap-4 justify-center">
        <button className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all active:scale-95">
           <AlertTriangle size={24} />
        </button>
        
        <button 
            onClick={onPass}
            className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all active:scale-95"
        >
           <X size={32} />
        </button>

        <button 
            onClick={onLike}
            className="w-16 h-16 rounded-2xl bg-orange-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-lg shadow-orange-900/40 hover:bg-orange-600 transition-all active:scale-95"
        >
           <Heart fill="currentColor" size={28} />
        </button>
    </div>
  );
};

export default ActionButtons;
