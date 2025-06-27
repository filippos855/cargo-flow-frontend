import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NotificationComponent, InvoiceFormComponent],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  totalCount = 0;

  isAdding = false;
  newInvoice!: Invoice;

  searchTerm = '';
  filterStartDateFrom?: string;
  filterStartDateTo?: string;

  sortKey: string = 'issueDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  currentPage = 1;
  pageSize = 10;

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'error' = 'success';

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getInvoices(
    this.searchTerm,
    this.sortKey,
    this.sortDirection,
    this.currentPage,
    this.pageSize,
    this.filterStartDateFrom,
    this.filterStartDateTo
  ).subscribe({
      next: res => {
        this.invoices = res.items;
        this.totalCount = res.totalCount;
      },
      error: err => {
        this.notificationMessage = 'Eroare la încărcarea facturilor!';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadInvoices();
  }

  setSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.loadInvoices();
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(offset: number): void {
    const next = this.currentPage + offset;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
      this.loadInvoices();
    }
  }

  addInvoice(): void {
    this.isAdding = true;
    this.newInvoice = {} as Invoice;
  }

  saveNewInvoice(invoice: Invoice): void {
    this.invoiceService.addInvoice(invoice).subscribe({
      next: () => {
        this.isAdding = false;
        this.notificationMessage = 'Factura a fost adăugată.';
        this.notificationType = 'success';
        this.showNotification = true;
        this.loadInvoices();
      },
      error: () => {
        this.notificationMessage = 'Eroare la adăugarea facturii!';
        this.notificationType = 'error';
        this.showNotification = true;
      }
    });
  }

  cancelNewInvoice(): void {
    this.isAdding = false;
    this.notificationMessage = 'Adăugarea facturii a fost anulată.';
    this.notificationType = 'info';
    this.showNotification = true;
  }

  get paginatedInvoices(): Invoice[] {
    return this.invoices;
  }
}
