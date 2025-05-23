import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [
    {
      id: 1,
      number: 'EMAG1',
      status: 'Creată',
      company: { id: 1, name: 'EMAG SRL', code: 'EMAG' },
      person: { id: 1, name: 'Ion Popescu', phone: '0722000000', email: 'ion@emag.ro' },
      address: 'Strada Fabricii, nr. 1, București',
      createdAt: new Date('2025-05-22T09:00:00'),
      includedInTrip: false,
      tripId: null,
      notes: 'Se livrează doar între 9-17.'
    },
    {
      id: 2,
      number: 'ALTEX1',
      status: 'Planificată',
      company: { id: 2, name: 'ALTEX SA', code: 'ALTEX' },
      person: { id: 2, name: 'Maria Ionescu', phone: '0733000000', email: 'maria@altex.ro' },
      address: 'Bulevardul Revoluției, nr. 45, Arad',
      createdAt: new Date('2025-05-21T15:30:00'),
      includedInTrip: true,
      tripId: 101,
      notes: ''
    }
  ];

  getOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.find(o => o.id === id);
  }

  updateOrder(updated: Order): void {
    const index = this.orders.findIndex(o => o.id === updated.id);
    if (index !== -1) {
      this.orders[index] = { ...updated };
    }
  }
}
