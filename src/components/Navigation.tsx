import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentView: 'wall' | 'submit';
  onNavigate: (view: 'wall' | 'submit') => void;
  brickCount: number;
}

export const Navigation = ({ currentView, onNavigate, brickCount }: NavigationProps) => {
  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border/20 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-brick rounded-lg flex items-center justify-center">
            <img src='/fanbrick-favicon.png' alt='Logo' />
            </div>
            <div>
              <h1 className="text-xl font-medium text-foreground">FanBrick</h1>
              <p className="text-xs text-muted-foreground font-light">Virtual Stadium Wall</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <div className="text-center">
              <div className="font-medium text-lg text-foreground">{brickCount}</div>
              <div className="text-muted-foreground font-light">Memories</div>
            </div>
            <div className="w-px h-8 bg-border/30"></div>
            <div className="text-center">
              <div className="font-medium text-lg text-foreground">∞</div>
              <div className="text-muted-foreground font-light">Stories</div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button
              variant={currentView === 'wall' ? 'default' : 'ghost'}
              onClick={() => onNavigate('wall')}
              className="text-sm font-medium"
              size="sm"
            >
              View Wall
            </Button>
            <Button
              variant={currentView === 'submit' ? 'default' : 'ghost'}
              onClick={() => onNavigate('submit')}
              className="text-sm font-medium"
              size="sm"
            >
              Add Memory
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};