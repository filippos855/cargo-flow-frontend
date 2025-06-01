import { Person } from './person.model';
import { FleetVehicle } from './fleet-vehicle.model';
import { Order } from './order.model';
import { TripStatus } from './trip-status.model';
import { Company } from './company.model';

export interface Trip {
  id: number;
  number: string; // Ex: "TRIP2024001"
  startDate: Date;
  endDate?: Date;
  status: TripStatus;

  // Firma care efectuează transportul
  transportCompany: Company;

  // Dacă este firma proprie, avem următoarele detalii:
  driver?: Person;
  tractorUnit?: FleetVehicle;
  trailer?: FleetVehicle;

  // Comenzile incluse în cursă
  orders?: Order[];
}
