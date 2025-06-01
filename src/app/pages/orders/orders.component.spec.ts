import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;

  const mockOrders: Order[] = [
    {
      id: 1,
      number: 'EMAG1',
      createdDate: new Date(),
      company: {
        id: 1,
        name: 'EMAG SRL',
        code: 'EMAG',
        contactPerson: { id: 1, fullName: 'Ion Popescu' }
      },
      deliveryPerson: { id: 2, fullName: 'Maria Ionescu' },
      status: { id: 1, name: 'Inițiat' },
      trip: undefined
    }
  ];

  const mockOrderService = {
    getOrders: () => mockOrders
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    expect(component.orders.length).toBe(1);
    expect(component.orders[0].number).toBe('EMAG1');
  });
});
