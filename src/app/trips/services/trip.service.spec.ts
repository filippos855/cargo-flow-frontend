import { TestBed } from '@angular/core/testing';
import { TripService } from './trip.service';
import { Trip } from '../models/trip.model';

describe('TripService', () => {
  let service: TripService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of trips', (done) => {
    service.getTrips().subscribe((trips: Trip[]) => {
      expect(trips.length).toBeGreaterThan(0);
      expect(trips[0].number).toBe('TRIP001');
      done();
    });
  });

  it('should return a trip by ID', (done) => {
    service.getTripById(1).subscribe((trip) => {
      expect(trip).toBeTruthy();
      expect(trip?.id).toBe(1);
      done();
    });
  });

  it('should return null for an invalid ID', (done) => {
    service.getTripById(999).subscribe((trip) => {
      expect(trip).toBeNull();
      done();
    });
  });
});
