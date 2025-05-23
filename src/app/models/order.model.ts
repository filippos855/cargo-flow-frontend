export type OrderStatus = 'Creată' | 'Planificată' | 'În curs' | 'Finalizată';

export interface Order {
  id: number;
  number: string;
  status: OrderStatus;
  company: {
    id: number;
    name: string;
    code: string;
  };
  person: {
    id: number;
    name: string;
    phone: string;
    email: string;
  };
  address: string;
  createdAt: Date;
  includedInTrip: boolean;
  tripId?: number | null;
  notes?: string;
}
