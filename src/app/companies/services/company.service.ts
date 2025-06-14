import { Injectable } from '@angular/core';
import { Company } from '../models/company.model';
import { Person } from '../../persons/models/person.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companies: Company[] = [];

  constructor() {
    const person1: Person = { id: 1, fullName: 'Popescu Ion' };
    const person2: Person = { id: 2, fullName: 'Ionescu Maria' };

    this.companies = [
      {
        id: 1,
        name: 'EMAG SRL',
        code: 'EMAG',
        cui: 'RO12345678',
        address: 'București, Str. Exemplu 1',
        contactPerson: person1
      },
      {
        id: 2,
        name: 'Altex SA',
        code: 'ALTEX',
        address: 'Iași, Bd. Libertății 45',
        contactPerson: person2
      }
    ];
  }

  getCompanies(): Company[] {
    return this.companies;
  }

  getCompanyById(id: number): Company | undefined {
    return this.companies.find(c => c.id === id);
  }

  updateCompany(updated: Company): void {
    const index = this.companies.findIndex(c => c.id === updated.id);
    if (index !== -1) {
      this.companies[index] = { ...updated };
    }
  }

  addCompany(company: Company): void {
    const maxId = Math.max(...this.companies.map(c => c.id), 0);
    company.id = maxId + 1;
    this.companies.push(company);
  }

  deleteCompanyById(id: number): void {
    this.companies = this.companies.filter(c => c.id !== id);
  }
}
