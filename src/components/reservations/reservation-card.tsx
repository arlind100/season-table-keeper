import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Calendar, MapPin, Phone, DollarSign, Utensils } from 'lucide-react';
import { Reservation } from '@/types';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ReservationCardProps {
  reservation: Reservation;
  onEdit: (reservation: Reservation) => void;
  onDelete: (reservationId: string) => void;
}

export function ReservationCard({ reservation, onEdit, onDelete }: ReservationCardProps) {
  const isUpcoming = new Date(reservation.date) >= new Date();
  
  return (
    <Card className="p-4 bg-gradient-card backdrop-blur-glass border-[var(--glass-border)] shadow-card hover:shadow-elevated transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-card-foreground truncate">
            {reservation.name} {reservation.surname}
          </h4>
          <div className="flex items-center gap-1 mt-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {format(new Date(reservation.date), 'MMM d, yyyy')}
            </span>
            {isUpcoming && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Upcoming
              </Badge>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur-sm border-border/50">
            <DropdownMenuItem onClick={() => onEdit(reservation)}>
              Edit Reservation
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(reservation.id)}
              className="text-destructive focus:text-destructive"
            >
              Delete Reservation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground truncate">{reservation.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground">{reservation.phone}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Utensils className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground truncate">{reservation.menu}</span>
          </div>
          <Badge variant="outline" className="text-xs">{reservation.hall}</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm pt-1">
          <DollarSign className="h-3 w-3 text-primary flex-shrink-0" />
          <span className="font-medium text-primary">${reservation.deposit.toLocaleString()}</span>
          <span className="text-muted-foreground">deposit</span>
        </div>
      </div>
    </Card>
  );
}