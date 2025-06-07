import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceDetailsComponent } from './invoice-details.component';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('InvoiceDetailsComponent', () => {
  let component: InvoiceDetailsComponent;
  let fixture: ComponentFixture<InvoiceDetailsComponent>;

  const mockInvoiceService = {
    getInvoiceById: (id: number) => ({
      id,
      number: 'INV-2024-001',
      invoiceType: { id: 1, name: 'Emisă', dictionaryId: 10 },
      status: { id: 1, name: 'Neachitată', dictionaryId: 11 },
      issueDate: new Date(),
      dueDate: new Date(),
      company: {
        id: 1,
        name: 'EMAG SRL',
        code: 'EMAG',
        contactPerson: { id: 1, fullName: 'Popescu Ion' }
      },
      amount: 2500,
      currency: 'RON',
      order: { id: 1, number: 'ORD-001' }
    }),
    updateInvoice: jasmine.createSpy('updateInvoice')
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
      imports: [InvoiceDetailsComponent],
      providers: [
        { provide: InvoiceService, useValue: mockInvoiceService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateInvoice on save()', () => {
    component.enableEdit();
    component.save();
    expect(mockInvoiceService.updateInvoice).toHaveBeenCalledWith(component.invoice);
  });

  it('should navigate back on goBack()', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/invoices']);
  });
});
