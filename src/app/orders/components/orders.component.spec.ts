import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let mockRouter: any;
  let mockOrderService: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockOrderService = {
      getOrders: () => [
        {
          id: 1,
          number: 'EMAG1',
          createdDate: new Date(),
          company: {
            id: 1,
            name: 'EMAG SRL',
            code: 'EMAG',
            contactPerson: { id: 1, fullName: 'Popescu Ion' }
          },
          deliveryPerson: { id: 2, fullName: 'Ionescu Maria' },
          status: { id: 1, dictionaryId: 1, name: 'Inițiat' },
          trip: undefined
        }
      ]
    };

    await TestBed.configureTestingModule({
      imports: [OrdersComponent, CommonModule, RouterModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: OrderService, useValue: mockOrderService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to order details on viewOrder()', () => {
    const order = { id: 1 } as any;
    component.viewOrder(order);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/orders', 1]);
  });
});
