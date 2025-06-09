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
import { FormsModule } from '@angular/forms';

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
  sortKey: 'number' | 'company' | 'deliveryPerson' | 'status' | 'createdDate' = 'createdDate';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 20;

  filterStartDate?: string;
  filterEndDate?: string;

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

  get filteredOrders(): Order[] {
    let filtered = this.orders;

    const search = this.searchTerm.toLowerCase();
    if (search) {
      filtered = filtered.filter(order =>
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
      filtered = filtered.filter(order => new Date(order.createdDate) >= start);
    }

    if (this.filterEndDate) {
      const end = new Date(this.filterEndDate);
      filtered = filtered.filter(order => new Date(order.createdDate) <= end);
    }

    const sorted = [...filtered].sort((a, b) => {
      const aVal = this.getSortValue(a);
      const bVal = this.getSortValue(b);
      return this.sortDirection === 'asc'
        ? aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        : aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });

    const start = (this.currentPage - 1) * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
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

  get totalPages(): number {
    return Math.ceil(
      this.orders.filter(order => {
        const search = this.searchTerm.toLowerCase();
        return (
          order.number.toLowerCase().includes(search) ||
          order.company.name.toLowerCase().includes(search) ||
          order.deliveryPerson.fullName.toLowerCase().includes(search) ||
          order.status.name.toLowerCase().includes(search) ||
          order.address.toLowerCase().includes(search) ||
          order.trip?.number?.toLowerCase().includes(search)
        );
      }).length / this.pageSize
    );
  }

  setSort(key: 'number' | 'company' | 'deliveryPerson' | 'status' | 'createdDate'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
  }

  changePage(offset: number): void {
    const next = this.currentPage + offset;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
    }
  }
}
