import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoicesComponent } from './invoices.component';
import { InvoiceService } from '../services/invoice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('InvoicesComponent', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;

  const mockInvoiceService = {
    getInvoices: () => [
      {
        id: 1,
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
      },
      {
        id: 2,
        number: 'INV-2024-002',
        invoiceType: { id: 2, name: 'Primită', dictionaryId: 10 },
        status: { id: 2, name: 'Achitată', dictionaryId: 11 },
        issueDate: new Date(),
        dueDate: new Date(),
        company: {
          id: 2,
          name: 'ALTEX SA',
          code: 'ALTEX',
          contactPerson: { id: 2, fullName: 'Ionescu Maria' }
        },
        amount: 4200,
        currency: 'RON',
        trip: { id: 2, number: 'TRIP-002' }
      }
    ]
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesComponent, CommonModule, RouterModule],
      providers: [
        { provide: InvoiceService, useValue: mockInvoiceService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to invoice details on viewInvoice()', () => {
    const invoice = { id: 1 } as any;
    component.viewInvoice(invoice);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/invoices', 1]);
  });
});
