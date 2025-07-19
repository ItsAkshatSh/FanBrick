export interface Brick {
  id: string;
  userEmail: string;
  memory: string;
  imageUrl?: string;
  color: string;
  club?: string;
  x: number;
  y: number;
  aiQuote?: string;
  emotion?: string;
  createdAt: Date;
  isFavorite?: boolean;
  tags?: string[];
  viewCount?: number;
}

export type SortOption = 'date-desc' | 'date-asc' | 'emotion' | 'popularity' | 'favorites';
export type ViewMode = 'wall' | 'calendar';

export const BRICK_COLORS = [
  { name: 'Primary', value: 'bg-brick-primary', class: 'bg-brick-primary' },
  { name: 'Secondary', value: 'bg-brick-secondary', class: 'bg-brick-secondary' },
  { name: 'Accent', value: 'bg-brick-accent', class: 'bg-brick-accent' },
  { name: 'Highlight', value: 'bg-brick-highlight', class: 'bg-brick-highlight' },
  { name: 'Muted', value: 'bg-brick-muted', class: 'bg-brick-muted' },
  { name: 'Card', value: 'bg-card', class: 'bg-card' }
];

export const FOOTBALL_CLUBS = [
  'Real Madrid',
  'FC Barcelona', 
  'Liverpool FC',
  'Manchester United',
  'Bayern Munich',
  'Juventus',
  'Paris Saint-Germain',
  'Chelsea FC',
  'Arsenal FC',
  'Manchester City',
  'AC Milan',
  'Inter Milan',
  'Borussia Dortmund',
  'Atletico Madrid',
  'Other'
];