import { TestBed } from '@angular/core/testing';
import { CompanyService } from './company.service';
import { Company } from '../models/company.model';
import { Person } from '../../persons/models/person.model';

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all companies', () => {
    const companies = service.getCompanies();
    expect(Array.isArray(companies)).toBeTrue();
    expect(companies.length).toBeGreaterThan(0);
  });

  it('should return a company by ID', () => {
    const company = service.getCompanyById(1);
    expect(company).toBeDefined();
    expect(company?.id).toBe(1);
  });

  it('should update an existing company', () => {
    const original = service.getCompanyById(1)!;
    const updated: Company = {
      ...original,
      address: 'Adresa Nouă'
    };

    service.updateCompany(updated);

    const result = service.getCompanyById(1);
    expect(result?.address).toBe('Adresa Nouă');
  });

  it('should not update a non-existent company', () => {
    const initialLength = service.getCompanies().length;

    const fakePerson: Person = { id: 99, fullName: 'Anonim' };

    const fakeCompany: Company = {
      id: 999,
      name: 'Fictiv SRL',
      code: 'FICTIV',
      contactPerson: fakePerson
    };

    service.updateCompany(fakeCompany);

    expect(service.getCompanies().length).toBe(initialLength);
    expect(service.getCompanyById(999)).toBeUndefined();
  });
});
