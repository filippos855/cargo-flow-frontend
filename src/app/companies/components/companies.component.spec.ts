import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompaniesComponent } from './companies.component';
import { Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('CompaniesComponent', () => {
  let component: CompaniesComponent;
  let fixture: ComponentFixture<CompaniesComponent>;
  let mockRouter: any;
  let mockCompanyService: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockCompanyService = {
      getCompanies: () => [
        {
          id: 1,
          name: 'EMAG SRL',
          code: 'EMAG',
          cui: 'RO12345678',
          address: 'București, Str. Exemplu 1',
          contactPerson: { id: 1, fullName: 'Popescu Ion' }
        }
      ]
    };

    await TestBed.configureTestingModule({
      imports: [CompaniesComponent, CommonModule, RouterModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: CompanyService, useValue: mockCompanyService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to company details on viewCompany()', () => {
    const company = { id: 1 } as any;
    component.viewCompany(company);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/resources/companies', 1]);
  });
});
