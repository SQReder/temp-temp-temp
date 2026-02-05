import React from 'react';
import { Calendar, MapPin, Heart, X, Filter } from 'lucide-react';
import { EventData } from '../types';

interface ListViewProps {
  events: EventData[];
  onOpenDetails: (event: EventData) => void;
}

const ListView: React.FC<ListViewProps> = ({ events, onOpenDetails }) => {
  return (
    <div className="h-full w-full overflow-y-auto pt-20 pb-24 px-4 scroll-smooth">
       <div className="fixed top-0 left-0 right-0 h-16 bg-[#0f0f0f]/80 backdrop-blur-lg z-10 flex items-center justify-between px-4 border-b border-white/5">
         <h1 className="text-xl font-bold">Events Nearby</h1>
         <button className="p-2 bg-white/10 rounded-lg"><Filter size={20} /></button>
       </div>

      <div className="space-y-4 mt-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-[#1c1c1e] rounded-2xl overflow-hidden shadow-lg border border-white/5"
          >
            {/* Clickable Area */}
            <div 
                onClick={() => onOpenDetails(event)}
                className="flex flex-row h-32 cursor-pointer active:opacity-80 transition-opacity"
            >
                <div className="w-32 h-full shrink-0 relative">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-[10px] px-2 py-0.5 rounded text-white">
                        {event.category}
                    </div>
                </div>
                
                <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg leading-tight line-clamp-1">{event.title}</h3>
                        <div className="mt-1 space-y-1 text-gray-400">
                            <div className="flex items-center text-xs">
                                <Calendar size={12} className="mr-1" />
                                <span className="truncate">{event.date}</span>
                            </div>
                            <div className="flex items-center text-xs">
                                <MapPin size={12} className="mr-1" />
                                <span className="truncate">{event.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Actions Footer */}
            <div className="px-3 py-2 bg-black/20 flex gap-2 border-t border-white/5">
                 <button className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center gap-2 text-sm text-gray-300 transition-colors">
                    <X size={16} />
                    Pass
                 </button>
                 <button className="flex-1 py-2 rounded-lg bg-orange-600/20 text-orange-500 hover:bg-orange-600/30 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                    <Heart size={16} fill="currentColor" />
                    Interested
                 </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;
