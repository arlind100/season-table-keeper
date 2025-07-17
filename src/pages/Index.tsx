import { useState } from 'react';
import { HomePage } from './HomePage';
import { SeasonPage } from './SeasonPage';
import { Season } from '@/types';

const Index = () => {
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);

  if (currentSeason) {
    return (
      <SeasonPage
        season={currentSeason}
        onBack={() => setCurrentSeason(null)}
      />
    );
  }

  return (
    <HomePage
      onSeasonSelect={setCurrentSeason}
    />
  );
};

export default Index;
