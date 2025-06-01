import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent] // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default dashboard values from ngOnInit()', () => {
    expect(component.totalOrders).toBe(128);
    expect(component.pendingOrders).toBe(14);
    expect(component.activeTrips).toBe(6);
    expect(component.expiringFleet).toBe(2);
    expect(component.unpaidInvoices).toBe(17);
    expect(component.activeClients).toBe(12);
  });
});
