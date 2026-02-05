import React from 'react';
import { Home, Heart, MessageCircle, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-6 pb-6 pt-2 pointer-events-none flex justify-center">
        {/* Floating Capsule Nav */}
        <div className="bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex items-center gap-8 shadow-2xl pointer-events-auto">
          <button className="flex flex-col items-center gap-1 text-orange-500">
            <span className="font-bold text-xs">TG</span>
            <span className="text-[10px] opacity-80">TogetGo</span>
          </button>
          
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Heart size={20} />
            <span className="text-[10px]">Liked</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <MessageCircle size={20} />
            <span className="text-[10px]">Chat</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <User size={20} />
            <span className="text-[10px]">Account</span>
          </button>
        </div>
    </div>
  );
};

export default BottomNav;
