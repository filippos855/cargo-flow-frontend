import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';
import { Company } from '../../companies/models/company.model';
import { Person } from '../../persons/models/person.model';
import { Order } from '../../orders/models/order.model';
import { Trip } from '../../trips/models/trip.model';
import { FleetVehicle } from '../../fleet/models/fleet-vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private invoices: Invoice[] = [];

  constructor() {
    const contactPerson: Person = { id: 1, fullName: 'Ion Popescu' };
    const deliveryPerson: Person = { id: 2, fullName: 'Maria Ionescu' };
    const driver: Person = { id: 3, fullName: 'George Vasile' };

    const company: Company = {
      id: 1,
      name: 'EMAG SRL',
      code: 'EMAG',
      contactPerson: contactPerson
    };

    const orderStatus: DictionaryItem = {
      id: 2,
      name: 'Inclusă în cursă',
      dictionary: { id: 1, name:"test" }
    };

    const order: Order = {
      id: 2,
      number: 'EMAG2',
      createdDate: new Date(),
      company,
      deliveryPerson,
      address: 'Șos. Colentina 101, București',
      status: orderStatus
    };

    const tractorUnit: FleetVehicle = {
      id: 10,
      identifier: 'B123XYZ',
      type: { id: 1, name: 'Tractor', dictionary: { id: 1, name:"test" } },
      itpExpiration: new Date(),
      rcaExpiration: new Date(),
      isAvailable: true
    };

    const trailer: FleetVehicle = {
      id: 11,
      identifier: 'CJ55ABC',
      type: { id: 2, name: 'Trailer', dictionary: { id: 1, name:"test" } },
      itpExpiration: new Date(),
      rcaExpiration: new Date(),
      isAvailable: true
    };

    const trip: Trip = {
      id: 101,
      number: 'TRIP2024001',
      startDate: new Date(),
      status: { id: 3, name: 'Planificată', dictionary: { id: 1, name:"test" } },
      transportCompany: company,
      driver,
      tractorUnit,
      trailer,
      orders: [order]
    };

    order.trip = trip;

    const typeEmisa: DictionaryItem = { id: 1, name: 'Emisă', dictionary: { id: 1, name:"test" } };
    const typePrimita: DictionaryItem = { id: 2, name: 'Primită', dictionary: { id: 1, name:"test" } };
    const statusNeachitata: DictionaryItem = { id: 1, name: 'Neachitată', dictionary: { id: 1, name:"test" } };
    const statusAchitata: DictionaryItem = { id: 2, name: 'Achitată', dictionary: { id: 1, name:"test" } };

    this.invoices = [
      {
        id: 1,
        number: 'INV-2024-001',
        invoiceType: typeEmisa,
        status: statusNeachitata,
        issueDate: new Date('2024-06-01'),
        dueDate: new Date('2024-06-10'),
        company,
        amount: 2500,
        currency: 'RON',
        order
      },
      {
        id: 2,
        number: 'INV-2024-002',
        invoiceType: typePrimita,
        status: statusAchitata,
        issueDate: new Date('2024-06-02'),
        dueDate: new Date('2024-06-15'),
        company,
        amount: 4200,
        currency: 'RON',
        trip
      }
    ];
  }

  getInvoices(): Invoice[] {
    return this.invoices;
  }

  getInvoiceById(id: number): Invoice | undefined {
    return this.invoices.find(i => i.id === id);
  }

  addInvoice(invoice: Invoice): void {
    invoice.id = Math.floor(Math.random() * 10000);
    this.invoices.push(invoice);
  }

  updateInvoice(updated: Invoice): void {
    const index = this.invoices.findIndex(i => i.id === updated.id);
    if (index !== -1) {
      this.invoices[index] = { ...updated };
    }
  }

  deleteInvoiceById(id: number): void {
    this.invoices = this.invoices.filter(i => i.id !== id);
  }
}
