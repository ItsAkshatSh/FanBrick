import { useState, useEffect, useMemo } from 'react';
import { Brick, SortOption, ViewMode } from '@/types/brick';
import { BrickWall } from '@/components/BrickWall';
import { BrickSubmissionForm } from '@/components/BrickSubmissionForm';
import { BrickControls } from '@/components/BrickControls';
import { BrickCalendarView } from '@/components/BrickCalendarView';
import { Navigation } from '@/components/Navigation';

const Index = () => {
  const [currentView, setCurrentView] = useState<'wall' | 'submit'>('wall');
  const [bricks, setBricks] = useState<Brick[]>([]);
  
  // Discovery & Organization state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('wall');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load bricks from localStorage on mount
  useEffect(() => {
    const savedBricks = localStorage.getItem('fanBricks');
    if (savedBricks) {
      const parsedBricks = JSON.parse(savedBricks).map((brick: any) => ({
        ...brick,
        createdAt: new Date(brick.createdAt)
      }));
      setBricks(parsedBricks);
    } else {
      // Add some sample bricks for demo
      const sampleBricks: Brick[] = [
        {
          id: '1',
          userEmail: 'legend@madrid.com',
          memory: 'Watching Ronaldo\'s bicycle kick against Juventus - pure magic! Still gives me goosebumps.',
          color: 'bg-team-blue',
          club: 'Real Madrid',
          x: 1,
          y: 1,
          aiQuote: 'Football is poetry in motion.',
          emotion: 'joy',
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          isFavorite: true,
          tags: ['legendary', 'champions-league'],
          viewCount: 15
        },
        {
          id: '2',
          userEmail: 'kop@liverpool.com',
          memory: 'You\'ll Never Walk Alone echoing through Anfield on European nights. Nothing compares.',
          color: 'bg-team-red',
          club: 'Liverpool FC',
          x: 2,
          y: 1,
          aiQuote: 'In every stadium, legends are born.',
          emotion: 'pride',
          createdAt: new Date(Date.now() - 172800000), // 2 days ago
          isFavorite: false,
          tags: ['anfield', 'ynwa'],
          viewCount: 8
        },
        {
          id: '3',
          userEmail: 'barca@fan.com',
          memory: 'Messi\'s last dance at Camp Nou. Tears of joy and sadness mixed together.',
          color: 'bg-team-yellow',
          club: 'FC Barcelona',
          x: 3,
          y: 1,
          aiQuote: 'Every memory is a victory in the heart.',
          emotion: 'nostalgia',
          createdAt: new Date(Date.now() - 259200000), // 3 days ago
          isFavorite: false,
          tags: ['messi', 'farewell'],
          viewCount: 12
        }
      ];
      setBricks(sampleBricks);
      localStorage.setItem('fanBricks', JSON.stringify(sampleBricks));
    }
  }, []);

  // Filter and sort bricks based on current settings
  const filteredAndSortedBricks = useMemo(() => {
    let filtered = [...bricks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(brick =>
        brick.memory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brick.aiQuote?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brick.club?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brick.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Emotion filter
    if (selectedEmotions.length > 0) {
      filtered = filtered.filter(brick => 
        brick.emotion && selectedEmotions.includes(brick.emotion)
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(brick =>
        brick.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(brick => brick.isFavorite);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'date-asc':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'emotion':
          return (a.emotion || '').localeCompare(b.emotion || '');
        case 'popularity':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'favorites':
          return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [bricks, searchQuery, selectedEmotions, selectedTags, showFavoritesOnly, sortBy]);

  // Get available emotions and tags for filters
  const availableEmotions = useMemo(() => {
    return Array.from(new Set(bricks.map(brick => brick.emotion).filter(Boolean))) as string[];
  }, [bricks]);

  const availableTags = useMemo(() => {
    return Array.from(new Set(bricks.flatMap(brick => brick.tags || [])));
  }, [bricks]);

  const handleBrickSubmit = (newBrickData: Omit<Brick, 'id' | 'x' | 'y' | 'createdAt'>) => {
    const newBrick: Brick = {
      ...newBrickData,
      id: Date.now().toString(),
      x: Math.floor(Math.random() * 8) + 1,
      y: Math.floor(Math.random() * 10) + 1,
      createdAt: new Date(),
      isFavorite: false,
      viewCount: 0
    };

    const updatedBricks = [...bricks, newBrick];
    setBricks(updatedBricks);
    localStorage.setItem('fanBricks', JSON.stringify(updatedBricks));
    
    // Navigate to wall to see the new brick
    setCurrentView('wall');
  };

  const handleToggleFavorite = (brickId: string) => {
    const updatedBricks = bricks.map(brick =>
      brick.id === brickId ? { ...brick, isFavorite: !brick.isFavorite } : brick
    );
    setBricks(updatedBricks);
    localStorage.setItem('fanBricks', JSON.stringify(updatedBricks));
  };

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentView={currentView}
        onNavigate={setCurrentView}
        brickCount={bricks.length}
      />
      
      {currentView === 'wall' ? (
        <div className="container mx-auto px-4">
          <BrickControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            selectedEmotions={selectedEmotions}
            onEmotionToggle={handleEmotionToggle}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={() => setShowFavoritesOnly(!showFavoritesOnly)}
            availableEmotions={availableEmotions}
            availableTags={availableTags}
          />
          
          {viewMode === 'wall' ? (
            <BrickWall 
              bricks={filteredAndSortedBricks} 
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            <BrickCalendarView 
              bricks={filteredAndSortedBricks}
              onBrickToggleFavorite={handleToggleFavorite}
            />
          )}
        </div>
      ) : (
        <BrickSubmissionForm 
          onSubmit={handleBrickSubmit}
          onCancel={() => setCurrentView('wall')}
        />
      )}
    </div>
  );
};

export default Index;
