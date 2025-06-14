import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { CompanyFormComponent } from '../company-form/company-form.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CompanyFormComponent, NotificationComponent],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  filtered: Company[] = [];

  isAdding = false;
  newCompany!: Company;

  searchTerm = '';
  sortKey: keyof Company = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  pageSize = 10;

  showNotification = false;
  notificationMessage = '';
  notificationType: 'success' | 'info' | 'error' = 'success';

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companies = this.companyService.getCompanies();
    this.applyFilters();
  }

  applyFilters(): void {
    const search = this.searchTerm.toLowerCase();

    let result = this.companies.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.code.toLowerCase().includes(search) ||
      (c.cui || '').toLowerCase().includes(search)
    );

    result.sort((a, b) => {
      const aVal = a[this.sortKey] || '';
      const bVal = b[this.sortKey] || '';
      return this.sortDirection === 'asc'
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });

    this.currentPage = 1;
    this.filtered = result;
  }

  setSort(key: keyof Company): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.applyFilters();
  }

  get paginatedCompanies(): Company[] {
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

  addCompany(): void {
    this.isAdding = true;
    this.newCompany = {
      id: 0,
      name: '',
      code: '',
      contactPerson: { id: 0, fullName: '' }
    };
  }

  saveNewCompany(company: Company): void {
    this.companyService.addCompany(company);
    this.loadCompanies();
    this.isAdding = false;
    this.notificationMessage = 'Firma a fost adăugată.';
    this.notificationType = 'success';
    this.showNotification = true;
  }

  cancelNewCompany(): void {
    this.isAdding = false;
    this.notificationMessage = 'Adăugarea a fost anulată.';
    this.notificationType = 'info';
    this.showNotification = true;
  }
}
