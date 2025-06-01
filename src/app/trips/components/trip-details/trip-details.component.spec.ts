import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripDetailsComponent } from './trip-details.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TripService } from '../../services/trip.service';
import { provideRouter } from '@angular/router';

describe('TripDetailsComponent', () => {
  let component: TripDetailsComponent;
  let fixture: ComponentFixture<TripDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetailsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', '1']]))
          }
        },
        {
          provide: TripService,
          useValue: {
            getTripById: (id: number) => of({
              id,
              number: 'TRIP123',
              startDate: new Date(),
              status: { id: 1, name: 'Creată', dictionaryId: 3 },
              transportCompany: { id: 1, name: 'Test Company', code: 'TC1', contactPerson: { id: 1, fullName: 'Ion Popescu' } },
              orders: []
            })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TripDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
