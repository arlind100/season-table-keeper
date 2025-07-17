import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Season } from '@/types';

interface SeasonFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season?: Season;
  onSubmit: (name: string) => void;
  isLoading?: boolean;
}

export function SeasonForm({ 
  open, 
  onOpenChange, 
  season, 
  onSubmit, 
  isLoading = false 
}: SeasonFormProps) {
  const [name, setName] = useState(season?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      if (!season) {
        setName('');
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen && !season) {
      setName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle>
            {season ? 'Edit Season' : 'Create New Season'}
          </DialogTitle>
          <DialogDescription>
            {season 
              ? 'Update the name of your reservation season.'
              : 'Create a new season to organize your reservations.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="season-name">Season Name</Label>
              <Input
                id="season-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Summer 2025, Wedding Season"
                className="bg-background/50"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name.trim() || isLoading}
              className="bg-gradient-primary"
            >
              {isLoading ? 'Saving...' : (season ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}