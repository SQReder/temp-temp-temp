import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, Variants, PanInfo } from 'framer-motion';
import { Calendar, MapPin, Users, Filter, Plus, Map, Hand } from 'lucide-react';
import { EventData } from '../types';
import ActionButtons from '../components/ActionButtons';

interface TinderCardProps {
    event: EventData;
    onSwipe: (direction: number) => void;
    onOpenDetails: (event: EventData) => void;
    onInteract: () => void;
}

const TinderCard: React.FC<TinderCardProps> = ({ event, onSwipe, onOpenDetails, onInteract }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);
    
    // Opacity for stamps - 1.5x faster
    const likeOpacity = useTransform(x, [15, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, -15], [1, 0]);

    useEffect(() => {
        const unsubscribe = x.on('change', (v) => {
            if (Math.abs(v) > 5) onInteract();
        });
        return () => unsubscribe();
    }, [x, onInteract]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe(1);
        } else if (info.offset.x < -100) {
            onSwipe(-1);
        }
    };

    const cardVariants: Variants = {
        initial: { scale: 0.95, y: 20, opacity: 0 },
        animate: { 
            scale: 1, 
            y: 0, 
            opacity: 1, 
            transition: { type: 'spring', stiffness: 300, damping: 20 } 
        },
        exit: (custom: number) => ({ 
            x: custom * 500, 
            opacity: 0, 
            rotate: custom * 25,
            transition: { duration: 0.3 } 
        })
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 m-4 rounded-[32px] overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl bg-[#1c1c1e] border border-white/10 touch-none"
            whileTap={{ scale: 0.98 }}
        >
            <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 pointer-events-none" />

            {/* Like Stamp */}
            <motion.div 
                style={{ opacity: likeOpacity }}
                className="absolute top-10 left-10 z-20 transform -rotate-12 border-4 border-green-500 rounded-lg px-4 py-2 bg-green-900/20 backdrop-blur-sm pointer-events-none"
            >
                <span className="text-4xl font-bold text-green-500 uppercase tracking-widest">Like</span>
            </motion.div>

            {/* Nope Stamp */}
            <motion.div 
                style={{ opacity: nopeOpacity }}
                className="absolute top-10 right-10 z-20 transform rotate-12 border-4 border-red-500 rounded-lg px-4 py-2 bg-red-900/20 backdrop-blur-sm pointer-events-none"
            >
                <span className="text-4xl font-bold text-red-500 uppercase tracking-widest">Nope</span>
            </motion.div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 flex flex-col gap-2 pointer-events-none select-none">
                <div className="bg-black/40 backdrop-blur-md self-start px-3 py-1 rounded-lg text-xs font-medium mb-1 border border-white/10 text-orange-400">
                    {event.category}
                </div>
                
                <h2 className="text-3xl font-bold leading-tight drop-shadow-lg">{event.title}</h2>
                
                <div className="space-y-2 mt-2">
                    <div className="flex items-center text-sm font-medium text-gray-200 drop-shadow-md">
                        <Calendar size={16} className="mr-2 text-orange-500" />
                        {event.date}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-200 drop-shadow-md">
                        <MapPin size={16} className="mr-2 text-orange-500" />
                        {event.location}
                    </div>
                    <div className="flex items-center text-sm font-medium text-gray-200 drop-shadow-md">
                        <Users size={16} className="mr-2 text-orange-500" />
                        {event.attendees}
                    </div>
                </div>

                {/* Tap area to view details */}
                <button 
                    className="absolute inset-0 pointer-events-auto"
                    onClick={() => {
                        if (Math.abs(x.get()) < 5) {
                            onOpenDetails(event);
                        }
                    }}
                    aria-label="View Details"
                />
            </div>
        </motion.div>
    );
};

interface TinderViewProps {
  events: EventData[];
  onOpenDetails: (event: EventData) => void;
}

const TinderView: React.FC<TinderViewProps> = ({ events, onOpenDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDir, setExitDir] = useState(0);
  const [showHint, setShowHint] = useState(true);

  const currentEvent = events[currentIndex];
  const nextEvent = events[currentIndex + 1];

  const handleSwipe = (direction: number) => {
      setExitDir(direction);
      setCurrentIndex((prev) => prev + 1);
  };

  const manualSwipe = (dir: 'left' | 'right') => {
      setExitDir(dir === 'right' ? 1 : -1);
      setCurrentIndex(prev => prev + 1);
      setShowHint(false);
  };

  if (!currentEvent) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-black/90">
        <h2 className="text-2xl font-bold mb-2">No more events!</h2>
        <p className="text-gray-400">Check back later for more.</p>
        <button 
            onClick={() => setCurrentIndex(0)}
            className="mt-6 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
            Reset Demo
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden pt-4 pb-32">
       {/* Top Controls Overlay */}
       <div className="absolute top-4 left-4 z-20">
            <button className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <Filter size={20} />
            </button>
        </div>
        <div className="absolute top-4 right-16 z-20 flex gap-3">
             <button className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <Plus size={20} />
            </button>
             <button className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <Map size={20} />
            </button>
        </div>


      <div className="relative w-full h-full flex items-center justify-center px-4">
        {/* Next Card (Background Placeholder) */}
        {nextEvent && (
          <div className="absolute inset-0 m-4 rounded-[32px] overflow-hidden bg-gray-800 scale-95 translate-y-4 opacity-50 pointer-events-none">
             <img src={nextEvent.imageUrl} className="w-full h-full object-cover grayscale" alt="" />
             <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        {/* Active Card with AnimatePresence */}
        <AnimatePresence custom={exitDir} mode="popLayout">
            <TinderCard
                key={currentEvent.id}
                event={currentEvent}
                onSwipe={handleSwipe}
                onOpenDetails={onOpenDetails}
                onInteract={() => setShowHint(false)}
            />
        </AnimatePresence>

        {/* Gesture Hint Overlay */}
        <AnimatePresence>
            {showHint && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-30"
                >
                    <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center shadow-2xl">
                        <motion.div
                            animate={{ x: [-20, 20, -20] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            <Hand size={48} className="text-white drop-shadow-lg" />
                        </motion.div>
                        <p className="text-white font-medium mt-4 text-sm uppercase tracking-wider drop-shadow-md">Swipe to choose</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-24 left-0 right-0 z-30 pointer-events-none">
        <div className="pointer-events-auto">
             <ActionButtons onPass={() => manualSwipe('left')} onLike={() => manualSwipe('right')} />
        </div>
      </div>
    </div>
  );
};

export default TinderView;