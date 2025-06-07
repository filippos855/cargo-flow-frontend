import { Person } from '../../persons/models/person.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: DictionaryItem;
  person: Person;
  isActive: boolean;
}
