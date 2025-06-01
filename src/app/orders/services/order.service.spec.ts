import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { Order } from '../models/order.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all orders', () => {
    const orders = service.getOrders();
    expect(Array.isArray(orders)).toBeTrue();
    expect(orders.length).toBeGreaterThan(0);
  });

  it('should return an order by ID', () => {
    const order = service.getOrderById(1);
    expect(order).toBeDefined();
    expect(order?.id).toBe(1);
  });

  it('should update an order', () => {
    const existingOrder = service.getOrderById(1)!;
    const updatedOrder: Order = {
      ...existingOrder,
      number: 'EMAG99'
    };

    service.updateOrder(updatedOrder);

    const result = service.getOrderById(1);
    expect(result?.number).toBe('EMAG99');
  });

  it('should not update a non-existent order', () => {
    const initialLength = service.getOrders().length;

    const fakeStatus: DictionaryItem = {
      id: 1,
      name: 'Inițiat',
      dictionaryId: 1
    };

    const fakeOrder: Order = {
      id: 999,
      number: 'FAKE999',
      createdDate: new Date(),
      company: {
        id: 9,
        name: 'Ghost Co.',
        code: 'GHOST',
        contactPerson: { id: 99, fullName: 'Anonim' }
      },
      deliveryPerson: { id: 98, fullName: 'Nimeni' },
      status: fakeStatus,
      trip: undefined
    };

    service.updateOrder(fakeOrder);
    expect(service.getOrders().length).toBe(initialLength);
    expect(service.getOrderById(999)).toBeUndefined();
  });

  it('should include an order in a mock trip', () => {
    const order = service.getOrderById(1)!;
    service.includeInMockTrip(order);

    const updatedOrder = service.getOrderById(1);
    expect(updatedOrder?.trip).toBeDefined();
    expect(updatedOrder?.status.name).toBe('Inclusă în cursă');
  });
});
