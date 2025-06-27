import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { OrderFormComponent } from '../order-form/order-form.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NotificationComponent, OrderFormComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  totalCount = 0;
  isAdding = false;
  newOrder!: Order;

  searchTerm = '';
  filterStartDate?: string;
  filterEndDate?: string;

  currentPage = 1;
  pageSize = 10;

  sortKey: 'number' | 'company' | 'deliveryPerson' | 'status' | 'createdDate' = 'createdDate';
  sortDirection: 'asc' | 'desc' = 'asc';

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'error' = 'success';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders(
      this.searchTerm,
      this.sortKey,
      this.sortDirection,
      this.currentPage,
      this.pageSize,
      this.filterStartDate,
      this.filterEndDate
    ).subscribe({
      next: (response) => {
        this.orders = response.items;
        this.totalCount = response.totalCount;
      },
      error: () => {
        this.showToast('Eroare la încărcarea comenzilor.', 'error');
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadOrders();
  }

  setSort(key: 'number' | 'company' | 'deliveryPerson' | 'status' | 'createdDate'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.loadOrders();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(offset: number): void {
    const nextPage = this.currentPage + offset;
    if (nextPage >= 1 && nextPage <= this.totalPages) {
      this.currentPage = nextPage;
      this.loadOrders();
    }
  }

  addOrder(): void {
    this.isAdding = true;
    this.newOrder = {} as Order;
  }

  saveNewOrder(order: Order): void {
    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.loadOrders();
        this.isAdding = false;
        this.showToast('Comanda a fost adăugată.', 'success');
      },
      error: () => {
        this.showToast('Eroare la adăugare.', 'error');
      }
    });
  }

  cancelNewOrder(): void {
    this.isAdding = false;
    this.showToast('Adăugarea comenzii a fost anulată.', 'info');
  }

  private showToast(message: string, type: 'success' | 'info' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }
}
