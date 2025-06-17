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
  filtered: Invoice[] = [];

  isAdding = false;
  newInvoice!: Invoice;

  searchTerm = '';
  filterStartDateFrom?: string;
  filterStartDateTo?: string;

  sortKey: keyof Invoice | 'company' | 'order' | 'trip' = 'issueDate';
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
    this.invoices = this.invoiceService.getInvoices();
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();
    const from = this.filterStartDateFrom ? new Date(this.filterStartDateFrom) : null;
    const to = this.filterStartDateTo ? new Date(this.filterStartDateTo) : null;

    let result = this.invoices.filter(i => {
      const matchSearch =
        i.number.toLowerCase().includes(search) ||
        i.company.name.toLowerCase().includes(search) ||
        i.order?.number?.toLowerCase().includes(search) ||
        i.trip?.number?.toLowerCase().includes(search);

      const matchFrom = !from || new Date(i.issueDate) >= from;
      const matchTo = !to || new Date(i.issueDate) <= to;

      return matchSearch && matchFrom && matchTo;
    });

    result.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (this.sortKey) {
        case 'company':
          aVal = a.company.name;
          bVal = b.company.name;
          break;
        case 'order':
          aVal = a.order?.number || '';
          bVal = b.order?.number || '';
          break;
        case 'trip':
          aVal = a.trip?.number || '';
          bVal = b.trip?.number || '';
          break;
        default:
          aVal = a[this.sortKey];
          bVal = b[this.sortKey];
      }

      return this.sortDirection === 'asc'
        ? aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        : aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });

    this.currentPage = 1;
    this.filtered = result;
  }

  setSort(key: keyof Invoice | 'company' | 'order' | 'trip'): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.applyFilters();
  }

  get paginatedInvoices(): Invoice[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filtered.length / this.pageSize);
  }

  changePage(offset: number): void {
    const next = this.currentPage + offset;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
    }
  }

  addInvoice(): void {
    this.isAdding = true;
    this.newInvoice = {
      id: 0,
      number: '',
      invoiceType: { id: 1, name: 'Emisă', dictionary: { id: 1, name:"test" } },
      status: { id: 1, name: 'Neachitată', dictionary: { id: 1, name:"test" } },
      issueDate: new Date(),
      dueDate: new Date(),
      company: { id: 1, name: '', code: '', contactPerson: { id: 1, fullName: '' } },
      amount: 0,
      currency: 'RON'
    };
  }

  saveNewInvoice(invoice: Invoice): void {
    this.invoiceService.addInvoice(invoice);
    this.loadInvoices();
    this.isAdding = false;
    this.notificationMessage = 'Factura a fost adăugată.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  cancelNewInvoice(): void {
    this.isAdding = false;
    this.notificationMessage = 'Adăugarea facturii a fost anulată.';
    this.notificationType = 'info';
    this.showNotification = true;
  }
}
