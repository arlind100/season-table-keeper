import { useState, useEffect } from 'react';
import { Season, Reservation, CreateSeasonData, CreateReservationData } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { useToast } from './use-toast';

// Mock data for demonstration
const initialSeasons: Season[] = [
  {
    id: '1',
    name: 'Summer 2025',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: '2', 
    name: 'Wedding Season',
    createdAt: new Date('2024-11-15'),
  }
];

const initialReservations: Reservation[] = [
  {
    id: '1',
    seasonId: '1',
    date: '2025-01-25',
    name: 'John',
    surname: 'Smith',
    address: '123 Main St, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    menu: 'Premium Menu',
    deposit: 500,
    hall: 'Hall A',
    numberOfPeople: 8,
    createdAt: new Date('2024-12-10'),
  },
  {
    id: '2',
    seasonId: '1',
    date: '2025-02-14',
    name: 'Emily',
    surname: 'Johnson',
    address: '456 Oak Ave, Brooklyn, NY 11201',
    phone: '+1 (555) 987-6543',
    menu: 'Wedding Package',
    deposit: 1200,
    hall: 'Garden',
    numberOfPeople: 150,
    createdAt: new Date('2024-12-12'),
  },
  {
    id: '3',
    seasonId: '2',
    date: '2025-03-20',
    name: 'Michael',
    surname: 'Brown',
    address: '789 Pine St, Queens, NY 11375',
    phone: '+1 (555) 456-7890',
    menu: 'Custom Menu',
    deposit: 800,
    hall: 'Hall B',
    numberOfPeople: 25,
    createdAt: new Date('2024-12-08'),
  }
];

export function useReservations() {
  const [seasons, setSeasons] = useLocalStorage<Season[]>('seasons', initialSeasons);
  const [reservations, setReservations] = useLocalStorage<Reservation[]>('reservations', initialReservations);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Season operations
  const createSeason = async (data: CreateSeasonData) => {
    setIsLoading(true);
    try {
      const newSeason: Season = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
      };
      setSeasons(prev => [newSeason, ...prev]);
      toast({
        title: "Season created",
        description: `"${data.name}" has been created successfully.`,
      });
      return newSeason;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create season. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSeason = async (id: string, data: Partial<CreateSeasonData>) => {
    setIsLoading(true);
    try {
      setSeasons(prev => prev.map(season => 
        season.id === id ? { ...season, ...data } : season
      ));
      toast({
        title: "Season updated",
        description: "Season has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Failed to update season. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSeason = async (id: string) => {
    setIsLoading(true);
    try {
      // Delete all reservations in this season
      setReservations(prev => prev.filter(res => res.seasonId !== id));
      // Delete the season
      setSeasons(prev => prev.filter(season => season.id !== id));
      toast({
        title: "Season deleted",
        description: "Season and all its reservations have been deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Failed to delete season. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reservation operations
  const createReservation = async (seasonId: string, data: CreateReservationData) => {
    setIsLoading(true);
    try {
      const newReservation: Reservation = {
        id: Date.now().toString(),
        seasonId,
        ...data,
        createdAt: new Date(),
      };
      setReservations(prev => [newReservation, ...prev]);
      toast({
        title: "Reservation created",
        description: `Reservation for ${data.name} ${data.surname} has been created.`,
      });
      return newReservation;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create reservation. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReservation = async (id: string, data: Partial<CreateReservationData>) => {
    setIsLoading(true);
    try {
      setReservations(prev => prev.map(reservation => 
        reservation.id === id ? { ...reservation, ...data } : reservation
      ));
      toast({
        title: "Reservation updated",
        description: "Reservation has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update reservation. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReservation = async (id: string) => {
    setIsLoading(true);
    try {
      setReservations(prev => prev.filter(reservation => reservation.id !== id));
      toast({
        title: "Reservation deleted",
        description: "Reservation has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete reservation. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getReservationsBySeason = (seasonId: string) => {
    return reservations
      .filter(res => res.seasonId === seasonId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const searchReservations = (query: string) => {
    if (!query.trim()) return reservations;
    
    const searchTerm = query.toLowerCase();
    return reservations.filter(reservation => 
      reservation.name.toLowerCase().includes(searchTerm) ||
      reservation.surname.toLowerCase().includes(searchTerm) ||
      reservation.phone.includes(searchTerm) ||
      reservation.hall.toLowerCase().includes(searchTerm) ||
      reservation.menu.toLowerCase().includes(searchTerm) ||
      reservation.date.includes(searchTerm)
    );
  };

  return {
    seasons,
    reservations,
    isLoading,
    // Season operations
    createSeason,
    updateSeason,
    deleteSeason,
    // Reservation operations  
    createReservation,
    updateReservation,
    deleteReservation,
    // Helper functions
    getReservationsBySeason,
    searchReservations,
  };
}