import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MobileLayout } from '@/components/ui/mobile-layout';
import { SearchBar } from '@/components/search/search-bar';
import { SeasonCard } from '@/components/seasons/season-card';
import { SeasonForm } from '@/components/seasons/season-form';
import { useReservations } from '@/hooks/useReservations';
import { Season } from '@/types';

interface HomePageProps {
  onSeasonSelect: (season: Season) => void;
}

export function HomePage({ onSeasonSelect }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSeasonForm, setShowSeasonForm] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | undefined>();
  
  const {
    seasons,
    reservations,
    isLoading,
    createSeason,
    updateSeason,
    deleteSeason,
    getReservationsBySeason,
    searchReservations,
  } = useReservations();

  const handleCreateSeason = async (name: string) => {
    await createSeason({ name });
    setShowSeasonForm(false);
  };

  const handleUpdateSeason = async (name: string) => {
    if (editingSeason) {
      await updateSeason(editingSeason.id, { name });
      setEditingSeason(undefined);
    }
  };

  const handleEditSeason = (season: Season) => {
    setEditingSeason(season);
  };

  const handleDeleteSeason = async (seasonId: string) => {
    if (window.confirm('Are you sure? This will delete the season and all its reservations.')) {
      await deleteSeason(seasonId);
    }
  };

  // Filter seasons based on search
  const filteredSeasons = searchQuery 
    ? seasons.filter(season => {
        const seasonReservations = getReservationsBySeason(season.id);
        const matchingReservations = searchReservations(searchQuery);
        return season.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               seasonReservations.some(res => matchingReservations.includes(res));
      })
    : seasons;

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-primary-foreground">
            Restaurant Reservations
          </h1>
          <p className="text-primary-foreground/80">
            Manage your seasons and reservations
          </p>
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search seasons or reservations..."
        />

        {/* Add Season Button */}
        <Button 
          onClick={() => setShowSeasonForm(true)}
          className="w-full bg-gradient-primary shadow-elevated"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Season
        </Button>

        {/* Seasons Grid */}
        <div className="space-y-4">
          {filteredSeasons.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground mb-2">
                {searchQuery ? 'No results found' : 'No seasons yet'}
              </h3>
              <p className="text-primary-foreground/70 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms'
                  : 'Create your first season to start organizing reservations'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setShowSeasonForm(true)}
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Create Season
                </Button>
              )}
            </div>
          ) : (
            filteredSeasons.map((season) => (
              <SeasonCard
                key={season.id}
                season={season}
                reservations={getReservationsBySeason(season.id)}
                onEdit={handleEditSeason}
                onDelete={handleDeleteSeason}
                onViewReservations={onSeasonSelect}
              />
            ))
          )}
        </div>
      </div>

      {/* Season Form Modal */}
      <SeasonForm
        open={showSeasonForm || !!editingSeason}
        onOpenChange={(open) => {
          if (!open) {
            setShowSeasonForm(false);
            setEditingSeason(undefined);
          }
        }}
        season={editingSeason}
        onSubmit={editingSeason ? handleUpdateSeason : handleCreateSeason}
        isLoading={isLoading}
      />
    </MobileLayout>
  );
}