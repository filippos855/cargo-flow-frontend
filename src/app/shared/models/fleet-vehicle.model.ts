import { DictionaryItem } from './dictionary-item.model';

export interface FleetVehicle {
  id: number;
  identifier: string;
  type: DictionaryItem; // ex: { id: 3, name: 'Tractor', dictionaryId: 3 }
  itpExpiration: Date;
  rcaExpiration: Date;
  isAvailable: boolean;
}