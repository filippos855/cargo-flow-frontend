import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FleetDetailsComponent } from './fleet-details.component';
import { FleetService } from '../../services/fleet.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('FleetDetailsComponent', () => {
  let component: FleetDetailsComponent;
  let fixture: ComponentFixture<FleetDetailsComponent>;

  const mockFleetService = {
    getVehicleById: (id: number) => ({
      id,
      identifier: 'B123XYZ',
      type: { id: 1, name: 'Tractor', dictionaryId: 3 },
      itpExpiration: new Date(),
      rcaExpiration: new Date(),
      isAvailable: true
    }),
    updateVehicle: jasmine.createSpy('updateVehicle')
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '10'
      }
    }
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FleetDetailsComponent],
      providers: [
        { provide: FleetService, useValue: mockFleetService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FleetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
