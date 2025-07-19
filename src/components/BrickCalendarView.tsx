import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Brick } from '@/types/brick';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BrickCalendarViewProps {
  bricks: Brick[];
  onBrickToggleFavorite: (brickId: string) => void;
}

export const BrickCalendarView = ({ bricks, onBrickToggleFavorite }: BrickCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getBricksForDate = (date: Date) => {
    return bricks.filter(brick => isSameDay(brick.createdAt, date));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const selectedDateBricks = selectedDate ? getBricksForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month start */}
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div key={`empty-${index}`} className="h-16" />
              ))}
              
              {/* Month days */}
              {monthDays.map((day) => {
                const dayBricks = getBricksForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const hasMemories = dayBricks.length > 0;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(isSelected ? null : day)}
                    className={cn(
                      "h-16 p-2 rounded-lg border border-border/20 transition-all duration-200",
                      "hover:border-border/40 hover:bg-muted/50",
                      isSelected && "bg-primary/20 border-primary/40",
                      isToday(day) && "ring-2 ring-primary/30",
                      hasMemories && "bg-accent/10"
                    )}
                  >
                    <div className="text-sm font-medium">{format(day, 'd')}</div>
                    {hasMemories && (
                      <div className="flex justify-center mt-1">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {dayBricks.length > 1 && (
                          <div className="ml-1 text-xs text-muted-foreground">
                            +{dayBricks.length - 1}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="lg:col-span-1">
          <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-2xl p-6">
            {selectedDate ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                
                {selectedDateBricks.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDateBricks.map((brick) => (
                      <div key={brick.id} className="border border-border/20 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {brick.emotion && (
                              <Badge variant="outline" className="capitalize text-xs">
                                {brick.emotion}
                              </Badge>
                            )}
                            {brick.club && (
                              <Badge variant="secondary" className="text-xs">
                                {brick.club}
                              </Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onBrickToggleFavorite(brick.id)}
                            className={cn(
                              "h-8 w-8 p-0",
                              brick.isFavorite && "text-red-500"
                            )}
                          >
                            <Heart 
                              className={cn(
                                "h-4 w-4",
                                brick.isFavorite && "fill-current"
                              )} 
                            />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-foreground/90 mb-2">
                          "{brick.memory}"
                        </p>
                        
                        {brick.aiQuote && (
                          <p className="text-xs text-muted-foreground italic">
                            "{brick.aiQuote}"
                          </p>
                        )}

                        {brick.tags && brick.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {brick.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground mt-2">
                          by {brick.userEmail.split('@')[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No memories on this date
                  </p>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">Calendar View</h3>
                <p className="text-muted-foreground text-sm">
                  Click on a date to view memories from that day. Days with memories are highlighted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};