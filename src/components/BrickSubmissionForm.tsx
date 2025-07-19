import { useState } from 'react';
import { Brick, BRICK_COLORS, FOOTBALL_CLUBS } from '@/types/brick';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BrickSubmissionFormProps {
  onSubmit: (brick: Omit<Brick, 'id' | 'x' | 'y' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const BrickSubmissionForm = ({ onSubmit, onCancel }: BrickSubmissionFormProps) => {
  const [memory, setMemory] = useState('');
  const [selectedColor, setSelectedColor] = useState(BRICK_COLORS[0].value);
  const [selectedClub, setSelectedClub] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Image too large",
          description: "Please choose an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memory.trim()) {
      toast({
        title: "Memory required",
        description: "Please share your football memory.",
        variant: "destructive"
      });
      return;
    }

    if (memory.length > 200) {
      toast({
        title: "Memory too long",
        description: "Please keep your memory under 200 characters.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate image upload
      let imageUrl = '';
      if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
      }

      // Generate AI quote (simulated)
      const aiQuotes = [
        "Every memory is a victory in the heart.",
        "Football is not just a game, it's a feeling.",
        "In every stadium, legends are born.",
        "The beautiful game creates beautiful memories.",
        "Where passion meets the pitch, magic happens."
      ];
      const aiQuote = aiQuotes[Math.floor(Math.random() * aiQuotes.length)];

      // Generate emotion (simulated)
      const emotions = ['joy', 'nostalgia', 'pride', 'excitement', 'love'];
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];

      const newBrick: Omit<Brick, 'id' | 'x' | 'y' | 'createdAt'> = {
        userEmail: 'fan@example.com', // In real app, this would come from auth
        memory: memory.trim(),
        imageUrl,
        color: selectedColor,
        club: selectedClub || undefined,
        aiQuote,
        emotion
      };

      onSubmit(newBrick);
      
      toast({
        title: "Brick placed! 🧱",
        description: "Your memory has been added to the stadium wall.",
      });
    } catch (error) {
      toast({
        title: "Failed to place brick",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-large border-border/20 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-brick rounded-xl flex items-center justify-center">
              <span className="text-2xl">🧱</span>
            </div>
            <CardTitle className="text-3xl font-light text-foreground">
              Add Your Memory
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground font-light">
              Share a football moment that will become part of our virtual wall
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Memory Input */}
              <div className="space-y-3">
                <Label htmlFor="memory" className="text-base font-medium text-foreground">
                  Your Memory *
                </Label>
                <Textarea
                  id="memory"
                  placeholder="Share your favorite football moment, memory, or tribute..."
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                  maxLength={200}
                  rows={4}
                  className="resize-none bg-background/50 border-border/30 focus:border-brick-highlight"
                />
                <div className="text-right text-sm text-muted-foreground font-light">
                  {memory.length}/200 characters
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium text-foreground">Brick Style *</Label>
                <div className="grid grid-cols-2 gap-3">
                  {BRICK_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-200 relative overflow-hidden",
                        "hover:scale-105 hover:shadow-medium",
                        selectedColor === color.value 
                          ? "border-brick-highlight ring-2 ring-brick-highlight/20" 
                          : "border-border/30 hover:border-border/50",
                        color.class
                      )}
                    >
                      <div className="relative z-10">
                        <div className="text-white text-sm font-medium drop-shadow-lg">
                          {color.name}
                        </div>
                      </div>
                      {selectedColor === color.value && (
                        <div className="absolute inset-0 bg-white/10"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Club Selection */}
              <div className="space-y-3">
                <Label htmlFor="club" className="text-base font-medium text-foreground">
                  Favorite Club (Optional)
                </Label>
                <Select value={selectedClub} onValueChange={setSelectedClub}>
                  <SelectTrigger className="bg-background/50 border-border/30 focus:border-brick-highlight">
                    <SelectValue placeholder="Select your favorite football club" />
                  </SelectTrigger>
                  <SelectContent>
                    {FOOTBALL_CLUBS.map((club) => (
                      <SelectItem key={club} value={club}>
                        {club}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <Label htmlFor="image" className="text-base font-medium text-foreground">
                  Add a Photo (Optional)
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer bg-background/50 border-border/30 focus:border-brick-highlight"
                />
                {imageFile && (
                  <div className="text-sm text-muted-foreground font-light">
                    Selected: {imageFile.name}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 font-medium"
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !memory.trim()}
                  className="flex-1 bg-gradient-brick hover:opacity-90 font-medium"
                  size="lg"
                >
                  {isSubmitting ? "Adding..." : "Add Memory"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};