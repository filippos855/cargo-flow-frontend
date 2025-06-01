import { Company } from './company.model';
import { DictionaryItem } from './dictionary-item.model';
import { FleetVehicle } from './fleet-vehicle.model';
import { Order } from '../../orders/models/order.model';
import { Person } from './person.model';

export interface Trip {
  id: number;
  number: string;
  startDate: Date;
  endDate?: Date;
  status: DictionaryItem; // ex: { id: 2, name: 'Finalizat', dictionaryId: 2 }
  transportCompany: Company;
  driver?: Person;
  tractorUnit?: FleetVehicle;
  trailer?: FleetVehicle;
  orders?: Order[];
}