import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderDetailsComponent } from './order-details.component';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;

  const mockOrderService = {
    getOrderById: (id: number) => ({
      id,
      number: 'EMAG1',
      company: { id: 1, name: 'EMAG SRL', code: 'EMAG', contactPerson: { id: 1, fullName: 'Popescu Ion' } },
      deliveryPerson: { id: 2, fullName: 'Ionescu Maria' },
      status: { id: 1, name: 'Inițiat' },
      createdDate: new Date(),
      trip: undefined
    }),
    updateOrder: jasmine.createSpy('updateOrder')
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
      imports: [OrderDetailsComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
