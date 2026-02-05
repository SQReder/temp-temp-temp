import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users } from 'lucide-react';
import { EventData } from '../types';

interface EventDetailsModalProps {
  event: EventData | null;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  return (
    <AnimatePresence>
      {event && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-[#1c1c1e] rounded-t-3xl z-50 overflow-hidden h-[85vh] flex flex-col"
          >
            {/* Header Image */}
            <div className="relative h-64 w-full shrink-0">
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <X size={24} />
              </button>
              <div className="absolute top-4 left-4 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md text-xs font-semibold text-white">
                {event.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <Calendar className="mr-3 text-orange-500" size={20} />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="mr-3 text-orange-500" size={20} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Users className="mr-3 text-orange-500" size={20} />
                  <span>{event.attendees}</span>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-white">About</h3>
                <p className="text-gray-400 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-colors">
                Book Ticket
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventDetailsModal;
