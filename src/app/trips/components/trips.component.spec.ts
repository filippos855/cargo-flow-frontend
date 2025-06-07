import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripsComponent } from './trips.component';
import { TripService } from '../services/trip.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('TripsComponent', () => {
  let component: TripsComponent;
  let fixture: ComponentFixture<TripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsComponent],
      providers: [
        provideRouter([]),
        {
          provide: TripService,
          useValue: {
            getTrips: () => of([])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
