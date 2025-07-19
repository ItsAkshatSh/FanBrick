import { Brick } from '@/types/brick';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BrickModalProps {
  brick: Brick;
  onClose: () => void;
}

export const BrickModal = ({ brick, onClose }: BrickModalProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            🧱 Memory from the Wall
            {brick.club && (
              <Badge variant="secondary" className="ml-2">
                {brick.club}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Brick Color Preview */}
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded shadow-sm", brick.color)}></div>
            <span className="text-sm text-muted-foreground">
              Placed on {formatDate(brick.createdAt)}
            </span>
          </div>

          {/* Image */}
          {brick.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={brick.imageUrl} 
                alt="Brick memory" 
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Memory Text */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-primary">Memory</h3>
            <p className="text-foreground leading-relaxed">
              {brick.memory}
            </p>
          </div>

          {/* AI Quote */}
          {brick.aiQuote && (
            <div className="bg-gradient-stadium text-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                🤖 AI Generated Quote
              </h3>
              <p className="italic">"{brick.aiQuote}"</p>
            </div>
          )}

          {/* Emotion & Metadata */}
          <div className="flex flex-wrap gap-2 items-center">
            {brick.emotion && (
              <Badge variant="outline" className="capitalize">
                😊 {brick.emotion}
              </Badge>
            )}
            <Badge variant="outline">
              📧 {brick.userEmail.split('@')[0]}
            </Badge>
            <Badge variant="outline">
              📍 Position ({brick.x}, {brick.y})
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};