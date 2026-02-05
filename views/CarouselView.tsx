import React, { useRef, useState, MouseEvent } from 'react';
import { Calendar, MapPin, Users, ChevronDown, Filter, Plus, Map } from 'lucide-react';
import { EventData } from '../types';

interface CarouselViewProps {
  events: EventData[];
}

const CarouselView: React.FC<CarouselViewProps> = ({ events }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Drag state refs
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeftVal = containerRef.current.scrollLeft;
      const width = containerRef.current.clientWidth;
      const index = Math.round(scrollLeftVal / width);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  // Mouse Drag Handlers for Desktop "Swipe"
  const handleMouseDown = (e: MouseEvent) => {
    if (!containerRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    
    // Disable smooth snapping while dragging for immediate feedback
    containerRef.current.style.scrollBehavior = 'auto';
    containerRef.current.style.scrollSnapType = 'none';
    containerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (isDown.current) {
        stopDragging();
    }
  };

  const handleMouseUp = () => {
    if (isDown.current) {
        stopDragging();
    }
  };
  
  const stopDragging = () => {
    if (!containerRef.current) return;
    isDown.current = false;
    containerRef.current.style.cursor = 'grab';
    containerRef.current.style.scrollSnapType = 'x mandatory';
    containerRef.current.style.scrollBehavior = 'smooth';
    
    // Manually snap to nearest slide to ensure alignment after drag
    const width = containerRef.current.clientWidth;
    const currentScroll = containerRef.current.scrollLeft;
    const nearestIndex = Math.round(currentScroll / width);
    
    // Use scrollTo for the final snap animation
    containerRef.current.scrollTo({
        left: nearestIndex * width,
        behavior: 'smooth'
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDown.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Multiplier for faster scroll
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="h-full w-full relative bg-black">
        {/* Top Controls Overlay - Fixed */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <button className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-black/40 transition-colors">
                <Filter size={20} />
            </button>
        </div>
        <div className="absolute top-4 right-16 z-20 flex gap-3 pointer-events-none">
             <button className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-black/40 transition-colors">
                <Plus size={20} />
            </button>
             <button className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto hover:bg-black/40 transition-colors">
                <Map size={20} />
            </button>
        </div>

      {/* Horizontal Scroll Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full h-full overflow-x-auto overflow-y-hidden flex snap-x snap-mandatory no-scrollbar cursor-grab touch-pan-x touch-pan-y"
        style={{ scrollBehavior: 'smooth' }}
      >
        {events.map((event) => (
          <div 
            key={event.id} 
            className="w-full h-full shrink-0 snap-center relative select-none"
          >
             {/* Vertical Scroll for Details */}
             <div className="w-full h-full overflow-y-auto snap-y snap-mandatory no-scrollbar relative">
                
                {/* 1. Full Screen Cover (Snap Start) */}
                <div className="w-full h-full relative snap-start shrink-0">
                    <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-full object-cover pointer-events-none"
                        draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 pb-28 flex flex-col gap-2">
                        <div className="bg-black/40 backdrop-blur-md self-start px-3 py-1 rounded-lg text-xs font-medium mb-1 border border-white/10 text-white">
                            {event.category}
                        </div>
                        <h2 className="text-4xl font-bold leading-tight text-white">{event.title}</h2>
                        
                        <div className="space-y-1 mt-2 mb-4">
                            <div className="flex items-center text-sm font-medium text-gray-200">
                                <Calendar size={16} className="mr-2" />
                                {event.date}
                            </div>
                            <div className="flex items-center text-sm font-medium text-gray-200">
                                <MapPin size={16} className="mr-2" />
                                {event.location}
                            </div>
                        </div>

                        {/* Hint to scroll down */}
                        <div className="flex flex-col items-center animate-bounce opacity-70 mt-4 pointer-events-none">
                            <span className="text-xs uppercase tracking-widest text-gray-300 mb-1">Details</span>
                            <ChevronDown size={24} />
                        </div>
                    </div>
                </div>

                {/* 2. Details Section (Snap Start) - Below the fold */}
                <div className="min-h-screen bg-[#1c1c1e] text-white p-6 pb-32 snap-start flex flex-col relative z-10 border-t border-white/10 rounded-t-[32px] -mt-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6 opacity-50" />
                    
                    <h3 className="text-2xl font-bold mb-4">About Event</h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8">
                        {event.description}
                    </p>

                    <div className="bg-black/20 rounded-2xl p-4 mb-6 space-y-4">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center text-gray-300">
                                <Users className="mr-3 text-orange-500" size={20} />
                                <span>{event.attendees}</span>
                            </div>
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#1c1c1e]" />
                                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#1c1c1e]" />
                                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-[#1c1c1e]" />
                            </div>
                         </div>
                    </div>

                    <div className="mt-auto">
                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 transition-all">
                            Join Event
                        </button>
                    </div>
                </div>

             </div>
          </div>
        ))}
      </div>

       {/* Pagination Dots */}
       <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 pointer-events-none z-30">
        {events.map((_, idx) => (
            <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                    idx === activeIndex ? 'bg-white w-6 opacity-100' : 'bg-white w-1.5 opacity-40'
                }`}
            />
        ))}
      </div>
    </div>
  );
};

export default CarouselView;