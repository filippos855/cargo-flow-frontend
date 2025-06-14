import { Company } from '../../companies/models/company.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';
import { FleetVehicle } from '../../fleet/models/fleet-vehicle.model';
import { Order } from '../../orders/models/order.model';
import { Person } from '../../persons/models/person.model';

export interface Trip {
  id: number;
  number: string;
  startDate: Date;
  endDate?: Date;
  status: DictionaryItem;
  transportCompany: Company;
  driver?: Person;
  tractorUnit?: FleetVehicle;
  trailer?: FleetVehicle;
  orders?: Order[];
}