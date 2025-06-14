import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    OrderFormComponent,
    NotificationComponent
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filtered: Order[] = [];
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

  searchTerm = '';
  filterStartDate?: string;
  filterEndDate?: string;

  sortKey: 'number' | 'company' | 'deliveryPerson' | 'status' | 'createdDate' = 'createdDate';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  pageSize = 20;

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
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.orders;

    const search = this.searchTerm.toLowerCase();
    if (search) {
      result = result.filter(order =>
        order.number.toLowerCase().includes(search) ||
        order.company.name.toLowerCase().includes(search) ||
        order.deliveryPerson.fullName.toLowerCase().includes(search) ||
        order.status.name.toLowerCase().includes(search) ||
        order.address.toLowerCase().includes(search) ||
        order.trip?.number?.toLowerCase().includes(search)
      );
    }

    if (this.filterStartDate) {
      const start = new Date(this.filterStartDate);
      result = result.filter(order => new Date(order.createdDate) >= start);
    }

    if (this.filterEndDate) {
      const end = new Date(this.filterEndDate);
      result = result.filter(order => new Date(order.createdDate) <= end);
    }

    result.sort((a, b) => {
      const aVal = this.getSortValue(a);
      const bVal = this.getSortValue(b);
      return this.sortDirection === 'asc'
        ? aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        : aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });

    this.currentPage = 1;
    this.filtered = result;
  }

  getSortValue(order: Order): any {
    switch (this.sortKey) {
      case 'company': return order.company.name;
      case 'deliveryPerson': return order.deliveryPerson.fullName;
      case 'status': return order.status.name;
      case 'createdDate': return order.createdDate;
      default: return order[this.sortKey];
    }
  }

  setSort(key: 'number' | 'company' | 'deliveryPerson' | 'status' | 'createdDate'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  changePage(offset: number): void {
    const next = this.currentPage + offset;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
    }
  }

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.pageSize);
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

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}
