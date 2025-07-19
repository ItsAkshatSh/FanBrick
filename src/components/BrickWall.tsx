import { Brick } from '@/types/brick';
import { BrickItem } from './BrickItem';

interface BrickWallProps {
  bricks: Brick[];
  onToggleFavorite?: (brickId: string) => void;
}

export const BrickWall = ({ bricks, onToggleFavorite }: BrickWallProps) => {
  // Create infinite brick layout without limits
  const createBrickLayout = () => {
    if (bricks.length === 0) return [];
    
    const layout = [];
    let brickIndex = 0;
    
    // Calculate how many rows we need based on actual bricks
    const bricksPerRow = 6;
    const totalRows = Math.ceil(bricks.length / bricksPerRow);

    for (let row = 0; row < totalRows; row++) {
      const isOffsetRow = row % 2 === 1;
      const bricksInThisRow = isOffsetRow ? 5 : 6; // Offset rows have fewer bricks
      
      for (let col = 0; col < bricksInThisRow && brickIndex < bricks.length; col++) {
        layout.push({
          brick: bricks[brickIndex],
          row,
          col,
          isOffset: isOffsetRow
        });
        brickIndex++;
      }
    }
    return layout;
  };

  const brickLayout = createBrickLayout();

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Minimalistic Header */}
      <div className="text-center py-12 px-4">
        <h1 className="text-5xl md:text-7xl font-light text-foreground mb-6 tracking-tight">
          FanBrick
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto font-light">
          Hover to discover stories from fellow football fans
        </p>
      </div>

      {/* Minimalistic Brick Wall */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-background/50 backdrop-blur-sm border border-border/20 rounded-2xl p-8 max-w-5xl mx-auto shadow-large">
          <div className="space-y-2">
            {Array.from({ length: Math.ceil(brickLayout.length / 6) }).map((_, rowIndex) => (
              <div 
                key={rowIndex} 
                className={`flex gap-2 justify-center ${rowIndex % 2 === 1 ? 'ml-8' : ''}`}
              >
                {brickLayout
                  .filter(item => item.row === rowIndex)
                  .map((item, colIndex) => (
                    <BrickItem
                      key={`${rowIndex}-${colIndex}`}
                      brick={item.brick}
                      isEmpty={!item.brick}
                      index={rowIndex * 6 + colIndex}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))
                }
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {bricks.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-brick flex items-center justify-center">
              <span className="text-3xl">🧱</span>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              No bricks yet
            </h3>
            <p className="text-muted-foreground font-light">
              Be the first to add a memory to the wall
            </p>
          </div>
        )}
      </div>
    </div>
  );
};