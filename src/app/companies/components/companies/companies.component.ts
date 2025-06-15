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
  totalCount = 0;

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
    this.companyService.getCompanies(
      this.searchTerm,
      this.sortKey,
      this.sortDirection,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.companies = response.items;
        this.totalCount = response.totalCount;
      },
      error: () => {
        this.showToast('Eroare la încărcarea firmelor.', 'error');
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadCompanies();
  }

  setSort(key: keyof Company): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.loadCompanies();
  }

  getSortIcon(key: keyof Company): string {
    if (this.sortKey !== key) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  changePage(offset: number): void {
    const next = this.currentPage + offset;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
      this.loadCompanies();
    }
  }

  addCompany(): void {
    this.isAdding = true;
    this.newCompany = {
      id: 0,
      name: '',
      code: '',
      cui: '',
      address: '',
      contactPerson: { id: 0, fullName: '' }
    };
  }

  saveNewCompany(company: Company): void {
    this.companyService.addCompany(company).subscribe({
      next: () => {
        this.loadCompanies();
        this.isAdding = false;
        this.showToast('Firma a fost adăugată.', 'success');
      },
      error: (err) => {
        const errorMessage = this.extractBackendError(err);
        this.showToast(errorMessage || 'Eroare la adăugare.', 'error');
      }
    });
  }

  cancelNewCompany(): void {
    this.isAdding = false;
    this.showToast('Adăugarea a fost anulată.', 'info');
  }

  showToast(message: string, type: 'success' | 'info' | 'error' = 'info'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
    setTimeout(() => (this.showNotification = false), 3000);
  }

  private extractBackendError(error: any): string | null {
    if (error?.error?.errors) {
      const errorObj = error.error.errors;
      const firstKey = Object.keys(errorObj)[0];
      return errorObj[firstKey]?.[0] || null;
    }

    if (error?.error?.error) {
      return error.error.error;
    }

    return null;
  }
}
