import { Company } from '../../companies/models/company.model';
import { Person } from '../../persons/models/person.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';
import { Trip } from '../../trips/models/trip.model';

export interface Order {
  id: number;
  number: string;
  createdDate: Date;
  company: Company;
  deliveryPerson: Person;
  address: string;
  status: DictionaryItem;
  trip?: Trip;
  tripId?: number;
  tripNumber?: string;
}
