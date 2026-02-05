export interface EventData {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: string;
  imageUrl: string;
  category: string;
  description: string;
}

export enum InteractionMode {
  TINDER = 'Tinder Swipe',
  LIST = 'List View',
  CAROUSEL = 'Carousel Scroll',
}
