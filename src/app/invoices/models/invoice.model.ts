import { Company } from '../../companies/models/company.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';
import { Order } from '../../orders/models/order.model';
import { Trip } from '../../trips/models/trip.model';

export interface Invoice {
  id: number;
  number: string;
  invoiceType: DictionaryItem;
  status: DictionaryItem;
  issueDate: Date;
  dueDate: Date;
  company: Company;
  amount: number;
  currency: string;
  order?: Order;
  trip?: Trip;
}