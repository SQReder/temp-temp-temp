import React, { useState } from 'react';
import TinderView from './views/TinderView';
import ListView from './views/ListView';
import CarouselView from './views/CarouselView';
import EventDetailsModal from './components/EventDetailsModal';
import BottomNav from './components/BottomNav';
import ModeSelector from './components/ModeSelector';
import { InteractionMode, EventData } from './types';
import { MOCK_EVENTS } from './constants';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<InteractionMode>(InteractionMode.TINDER);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  const renderView = () => {
    switch (currentMode) {
      case InteractionMode.TINDER:
        return <TinderView events={MOCK_EVENTS} onOpenDetails={setSelectedEvent} />;
      case InteractionMode.LIST:
        return <ListView events={MOCK_EVENTS} onOpenDetails={setSelectedEvent} />;
      case InteractionMode.CAROUSEL:
        // Carousel handles its own details view via scroll, but we could also invoke modal if needed.
        // Based on prompt "scroll down - details unfold", the View handles it internally.
        return <CarouselView events={MOCK_EVENTS} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-[#0f0f0f] text-white overflow-hidden max-w-md mx-auto shadow-2xl border-x border-white/5">
      
      {/* Mode Switcher */}
      <ModeSelector currentMode={currentMode} onModeChange={setCurrentMode} />

      {/* Main Content Area */}
      <main className="h-full w-full">
        {renderView()}
      </main>

      {/* Bottom Navigation (Persistent) */}
      <BottomNav />

      {/* Detail Modal (Shared for Tinder & List) */}
      <EventDetailsModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
};

export default App;
