import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyDetailsComponent } from './company-details.component';
import { CompanyService } from '../../services/company.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('CompanyDetailsComponent', () => {
  let component: CompanyDetailsComponent;
  let fixture: ComponentFixture<CompanyDetailsComponent>;

  const mockCompanyService = {
    getCompanyById: (id: number) => ({
      id,
      name: 'EMAG SRL',
      code: 'EMAG',
      cui: 'RO12345678',
      address: 'București',
      contactPerson: { id: 1, fullName: 'Popescu Ion' }
    }),
    updateCompany: jasmine.createSpy('updateCompany')
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '1'
      }
    }
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyDetailsComponent],
      providers: [
        { provide: CompanyService, useValue: mockCompanyService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateCompany on save()', () => {
    component.enableEdit();
    component.save();
    expect(mockCompanyService.updateCompany).toHaveBeenCalledWith(component.company);
  });

  it('should navigate back on goBack()', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/resources/companies']);
  });
});
