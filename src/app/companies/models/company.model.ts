import { Person } from '../../persons/models/person.model';

export interface Company {
  id: number;
  name: string;
  code: string;
  cui?: string;
  address?: string;
  contactPerson: Person;
}
