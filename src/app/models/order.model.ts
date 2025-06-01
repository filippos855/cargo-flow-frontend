import { Company } from './company.model';
import { Person } from './person.model';
import { OrderStatus } from './order-status.model';
import { Trip } from './trip.model';

export interface Order {
  id: number;
  number: string;
  createdDate: Date;
  company: Company; // firma care a plasat comanda
  deliveryPerson: Person; // persoana către care se livrează
  status: OrderStatus;
  trip?: Trip;
}
