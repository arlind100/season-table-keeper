export interface Season {
  id: string;
  name: string;
  createdAt: Date;
  userId?: string;
}

export interface Reservation {
  id: string;
  seasonId: string;
  date: string;
  name: string;
  surname: string;
  address: string;
  phone: string;
  menu: string;
  deposit: number;
  hall: string;
  numberOfPeople: number;
  createdAt: Date;
  userId?: string;
}

export type CreateReservationData = Omit<Reservation, 'id' | 'createdAt' | 'userId'>;
export type UpdateReservationData = Partial<CreateReservationData>;

export type CreateSeasonData = Omit<Season, 'id' | 'createdAt' | 'userId'>;
export type UpdateSeasonData = Partial<CreateSeasonData>;