import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Calendar, Users } from 'lucide-react';
import { Season, Reservation } from '@/types';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SeasonCardProps {
  season: Season;
  reservations: Reservation[];
  onEdit: (season: Season) => void;
  onDelete: (seasonId: string) => void;
  onViewReservations: (season: Season) => void;
}

export function SeasonCard({ 
  season, 
  reservations, 
  onEdit, 
  onDelete, 
  onViewReservations 
}: SeasonCardProps) {
  const reservationCount = reservations.length;
  const totalDeposit = reservations.reduce((sum, res) => sum + res.deposit, 0);
  
  const nextReservation = reservations
    .filter(res => new Date(res.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <Card 
      className="p-6 bg-gradient-card backdrop-blur-glass border-[var(--glass-border)] shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer group"
      onClick={() => onViewReservations(season)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {season.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Created {format(season.createdAt, 'MMM d, yyyy')}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm border-border/50">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(season);
            }}>
              Edit Season
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(season.id);
              }}
              className="text-destructive focus:text-destructive"
            >
              Delete Season
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-sm text-card-foreground">
            {reservationCount} reservation{reservationCount !== 1 ? 's' : ''}
          </span>
          {reservationCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              ${totalDeposit.toLocaleString()}
            </Badge>
          )}
        </div>

        {nextReservation && (
          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">
                {nextReservation.name} {nextReservation.surname}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(nextReservation.date), 'MMM d, yyyy')} • {nextReservation.hall}
              </p>
            </div>
          </div>
        )}

        {reservationCount === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No reservations yet</p>
            <p className="text-xs">Tap to add your first one</p>
          </div>
        )}
      </div>
    </Card>
  );
}