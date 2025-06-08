import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { OrderFormComponent } from '../order-form/order-form.component';
import { Company } from '../../../companies/models/company.model';
import { Person } from '../../../persons/models/person.model';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { Trip } from '../../../trips/models/trip.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, OrderFormComponent, NotificationComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isAdding = false;

  newOrder: Order = {
    id: 0,
    number: '',
    createdDate: new Date(),
    company: {} as Company,
    deliveryPerson: {} as Person,
    address: '',
    status: {} as DictionaryItem,
    trip: undefined
  };

  companies: Company[] = [];
  persons: Person[] = [];
  statuses: DictionaryItem[] = [];
  trips: Trip[] = [];

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'info' = 'info';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.orders = this.orderService.getOrders();
    this.companies = this.orderService.getMockCompanies();
    this.persons = this.orderService.getMockPersons();
    this.statuses = this.orderService.getMockStatuses();
    this.trips = this.orderService.getMockTrips();
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }

  addOrder(): void {
    this.newOrder = {
      id: 0,
      number: '',
      createdDate: new Date(),
      company: {} as Company,
      deliveryPerson: {} as Person,
      address: '',
      status: {} as DictionaryItem,
      trip: undefined
    };
    this.isAdding = true;
  }

  saveNewOrder(order: Order): void {
    const prefix = order.company?.code ?? 'ORD';
    const count = this.orders.filter(o => o.company.code === prefix).length + 1;
    order.number = `${prefix}${count}`;

    this.orderService.createOrder(order);
    this.isAdding = false;
    this.refreshData();
    this.showToast('Comanda a fost adăugată.', 'success');
  }

  cancelNewOrder(): void {
    this.isAdding = false;
    this.showToast('Adăugarea comenzii a fost anulată.', 'info');
  }
}
