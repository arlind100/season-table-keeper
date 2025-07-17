import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { MobileLayout } from '@/components/ui/mobile-layout';
import { SearchBar } from '@/components/search/search-bar';
import { ReservationCard } from '@/components/reservations/reservation-card';
import { ReservationForm, ReservationFormData } from '@/components/reservations/reservation-form';
import { useReservations } from '@/hooks/useReservations';
import { Season, Reservation } from '@/types';
import { format } from 'date-fns';

interface SeasonPageProps {
  season: Season;
  onBack: () => void;
}

export function SeasonPage({ season, onBack }: SeasonPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | undefined>();
  
  const {
    isLoading,
    createReservation,
    updateReservation,
    deleteReservation,
    getReservationsBySeason,
    searchReservations,
  } = useReservations();

  const seasonReservations = getReservationsBySeason(season.id);

  const handleCreateReservation = async (data: ReservationFormData) => {
    await createReservation(season.id, {
      seasonId: season.id,
      ...data,
    });
    setShowReservationForm(false);
  };

  const handleUpdateReservation = async (data: ReservationFormData) => {
    if (editingReservation) {
      await updateReservation(editingReservation.id, data);
      setEditingReservation(undefined);
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
  };

  const handleDeleteReservation = async (reservationId: string) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      await deleteReservation(reservationId);
    }
  };

  // Filter reservations based on search
  const filteredReservations = searchQuery 
    ? seasonReservations.filter(reservation => {
        const query = searchQuery.toLowerCase();
        return reservation.name.toLowerCase().includes(query) ||
               reservation.surname.toLowerCase().includes(query) ||
               reservation.phone.includes(query) ||
               reservation.hall.toLowerCase().includes(query) ||
               reservation.menu.toLowerCase().includes(query) ||
               reservation.date.includes(query);
      })
    : seasonReservations;

  const totalDeposits = seasonReservations.reduce((sum, res) => sum + res.deposit, 0);

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-primary-foreground">
                {season.name}
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                {seasonReservations.length} reservations • ${totalDeposits.toLocaleString()} total deposits
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-card backdrop-blur-glass border-[var(--glass-border)] p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-card-foreground">
                {seasonReservations.length}
              </div>
              <div className="text-sm text-muted-foreground">Reservations</div>
            </div>
            <div className="bg-gradient-card backdrop-blur-glass border-[var(--glass-border)] p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-primary">
                ${totalDeposits.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Deposits</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search reservations..."
        />

        {/* Add Reservation Button */}
        <Button 
          onClick={() => setShowReservationForm(true)}
          className="w-full bg-gradient-primary shadow-elevated"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Reservation
        </Button>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">
                {searchQuery ? 'No reservations found' : 'No reservations yet'}
              </h3>
              <p className="text-primary-foreground/70 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : `Add your first reservation to ${season.name}`
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setShowReservationForm(true)}
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Add Reservation
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Group by month for better organization */}
              {Object.entries(
                filteredReservations.reduce((groups, reservation) => {
                  const monthKey = format(new Date(reservation.date), 'MMMM yyyy');
                  if (!groups[monthKey]) groups[monthKey] = [];
                  groups[monthKey].push(reservation);
                  return groups;
                }, {} as Record<string, Reservation[]>)
              ).map(([month, monthReservations]) => (
                <div key={month}>
                  <h3 className="text-sm font-medium text-primary-foreground/80 mb-3 px-1">
                    {month}
                  </h3>
                  <div className="space-y-3">
                    {monthReservations.map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onEdit={handleEditReservation}
                        onDelete={handleDeleteReservation}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reservation Form Modal */}
      <ReservationForm
        open={showReservationForm || !!editingReservation}
        onOpenChange={(open) => {
          if (!open) {
            setShowReservationForm(false);
            setEditingReservation(undefined);
          }
        }}
        reservation={editingReservation}
        onSubmit={editingReservation ? handleUpdateReservation : handleCreateReservation}
        isLoading={isLoading}
      />
    </MobileLayout>
  );
}