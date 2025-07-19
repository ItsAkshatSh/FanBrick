import { useState } from 'react';
import { Heart, Tag } from 'lucide-react';
import { Brick } from '@/types/brick';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BrickItemProps {
  brick: Brick | null;
  index: number;
  isEmpty?: boolean;
  onToggleFavorite?: (brickId: string) => void;
}

export const BrickItem = ({ brick, index, isEmpty = false, onToggleFavorite }: BrickItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDoubleClick = () => {
    if (onToggleFavorite && brick?.id) {
      onToggleFavorite(brick.id);
    }
  };

  // Add stagger animation delay
  const animationDelay = `${index * 20}ms`;

  if (!brick || isEmpty) {
    // Empty brick slot for visual completeness
    return (
      <div
        className="w-36 h-20 bg-muted/30 border border-border/30 rounded-md animate-fade-up opacity-40"
        style={{ animationDelay }}
      />
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="relative">
      {/* The Brick */}
      <div
        className={cn(
          "w-36 h-20 rounded-md cursor-pointer transition-all duration-300 relative",
          "hover:scale-105 hover:z-30 animate-fade-up border border-border/20",
          "shadow-subtle hover:shadow-medium",
          brick.color
        )}
        style={{ animationDelay }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-md"></div>
        
        {/* Favorite indicator */}
        {brick.isFavorite && (
          <div className="absolute top-2 left-2">
            <Heart className="h-4 w-4 text-red-500 fill-current" />
          </div>
        )}

        {/* Club indicator */}
        {brick.club && (
          <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded-full text-[10px] font-medium">
            {brick.club.slice(0, 3).toUpperCase()}
          </div>
        )}

        {/* Tags indicator */}
        {brick.tags && brick.tags.length > 0 && (
          <div className="absolute bottom-2 left-2">
            <Tag className="h-3 w-3 text-white/70" />
          </div>
        )}

        {/* Image indicator */}
        {brick.imageUrl && (
          <div className="absolute bottom-2 left-2 text-white/80 text-sm ml-6">
            📷
          </div>
        )}

        {/* Date indicator */}
        <div className="absolute bottom-2 right-2 text-xs text-white/70 font-light">
          {formatDate(brick.createdAt)}
        </div>

        {/* Hover indicator */}
        <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center">
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Readable Hover Card - Only shows when hovering on brick */}
      {isHovered && (
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50 transition-all duration-300 opacity-100"
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-card/95 backdrop-blur-md border border-border/30 rounded-2xl shadow-2xl p-6 w-80">
            {/* Main Memory */}
            <div className="mb-6">
              <p className="text-xl font-medium text-foreground leading-relaxed">
                "{brick.memory}"
              </p>
            </div>
            
            {/* AI Quote */}
            {brick.aiQuote && (
              <div className="mb-6 border-l-4 border-accent/50 pl-4">
                <p className="text-lg italic text-muted-foreground leading-relaxed">
                  "{brick.aiQuote}"
                </p>
              </div>
            )}

            {/* Image preview */}
            {brick.imageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden">
                <img 
                  src={brick.imageUrl} 
                  alt="Memory" 
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Tags */}
            {brick.tags && brick.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {brick.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">
                  by <span className="font-medium">{brick.userEmail.split('@')[0]}</span>
                </span>
                {brick.emotion && (
                  <span className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full capitalize font-medium">
                    {brick.emotion}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  {brick.club && (
                    <span className="font-medium">{brick.club}</span>
                  )}
                  <span>{formatDate(brick.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};