import { DictionaryItem } from '../../shared/models/dictionary-item.model';

export interface FleetVehicle {
  id: number;
  identifier: string;
  type: DictionaryItem;
  itpExpiration: Date;
  rcaExpiration: Date;
  isAvailable: boolean;
}