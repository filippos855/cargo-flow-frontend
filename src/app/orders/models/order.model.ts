import { Company } from '../../shared/models/company.model';
import { Person } from '../../shared/models/person.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';
import { Trip } from '../../shared/models/trip.model';

export interface Order {
  id: number;
  number: string;
  createdDate: Date;
  company: Company;
  deliveryPerson: Person;
  status: DictionaryItem; // ex: { id: 1, name: 'Inițiat', dictionaryId: 1 }
  trip?: Trip;
}