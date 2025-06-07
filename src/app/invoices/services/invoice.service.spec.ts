import { TestBed } from '@angular/core/testing';
import { InvoiceService } from './invoice.service';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all invoices', () => {
    const invoices = service.getInvoices();
    expect(Array.isArray(invoices)).toBeTrue();
    expect(invoices.length).toBeGreaterThan(0);
  });

  it('should return an invoice by ID', () => {
    const invoice = service.getInvoiceById(1);
    expect(invoice).toBeDefined();
    expect(invoice?.id).toBe(1);
  });

  it('should update an existing invoice', () => {
    const original = service.getInvoiceById(1)!;
    const updated = { ...original, amount: 9999 };
    service.updateInvoice(updated);
    const result = service.getInvoiceById(1);
    expect(result?.amount).toBe(9999);
  });

  it('should not update a non-existent invoice', () => {
    const initialLength = service.getInvoices().length;
    const fake = {
      id: 999,
      number: 'FAKE',
      invoiceType: { id: 99, name: 'Fake', dictionaryId: 10 },
      status: { id: 99, name: 'Fake', dictionaryId: 11 },
      issueDate: new Date(),
      dueDate: new Date(),
      company: {
        id: 9,
        name: 'Ghost Co',
        code: 'GHOST',
        contactPerson: { id: 9, fullName: 'Nimeni' }
      },
      amount: 123,
      currency: 'EUR',
      order: undefined,
      trip: undefined
    };

    service.updateInvoice(fake as any);
    expect(service.getInvoices().length).toBe(initialLength);
    expect(service.getInvoiceById(999)).toBeUndefined();
  });
});
