import { useState } from 'react';
import { Calendar, Filter, Grid, Heart, Search, SortAsc, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SortOption, ViewMode } from '@/types/brick';
import { cn } from '@/lib/utils';

interface BrickControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedEmotions: string[];
  onEmotionToggle: (emotion: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showFavoritesOnly: boolean;
  onFavoritesToggle: () => void;
  availableEmotions: string[];
  availableTags: string[];
}

export const BrickControls = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedEmotions,
  onEmotionToggle,
  selectedTags,
  onTagToggle,
  viewMode,
  onViewModeChange,
  showFavoritesOnly,
  onFavoritesToggle,
  availableEmotions,
  availableTags,
}: BrickControlsProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = selectedEmotions.length + selectedTags.length + (showFavoritesOnly ? 1 : 0);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-6 mb-8">
      {/* Top Row - Search and View Toggle */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'wall' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('wall')}
            className="flex items-center gap-2"
          >
            <Grid className="h-4 w-4" />
            Wall
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('calendar')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </Button>
        </div>
      </div>

      {/* Bottom Row - Sort, Filters, and Favorites */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="emotion">By Emotion</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="favorites">Favorites First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Favorites Toggle */}
        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          size="sm"
          onClick={onFavoritesToggle}
          className={cn(
            "flex items-center gap-2",
            showFavoritesOnly && "bg-red-500 hover:bg-red-600 text-white"
          )}
        >
          <Heart className={cn("h-4 w-4", showFavoritesOnly && "fill-current")} />
          Favorites Only
        </Button>

        {/* Filters */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="font-semibold">Filter Options</div>
              
              {/* Emotions Filter */}
              {availableEmotions.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Emotions</label>
                  <div className="flex flex-wrap gap-2">
                    {availableEmotions.map((emotion) => (
                      <Badge
                        key={emotion}
                        variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => onEmotionToggle(emotion)}
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Filter */}
              {availableTags.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => onTagToggle(tag)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectedEmotions.forEach(onEmotionToggle);
                    selectedTags.forEach(onTagToggle);
                    if (showFavoritesOnly) onFavoritesToggle();
                  }}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};