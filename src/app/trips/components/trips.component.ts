import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Trip } from '../models/trip.model';
import { TripService } from '../services/trip.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss']
})
export class TripsComponent implements OnInit {
  trips$: Observable<Trip[]> = this.tripService.getTrips();

  constructor(private tripService: TripService) {}

  ngOnInit(): void {}

  addMockTrip(): void {
    const newTrip: Trip = {
      id: Math.floor(Math.random() * 1000) + 100,
      number: `TRIP${Math.floor(Math.random() * 1000)}`,
      startDate: new Date(),
      status: { id: 1, name: 'Creată', dictionaryId: 2 },
      transportCompany: {
        id: 1,
        name: 'Test Company',
        code: 'TST',
        contactPerson: { id: 1, fullName: 'Popescu Ion' }
      },
      orders: []
    };

    this.tripService.addMockTrip(newTrip);
    this.trips$ = this.tripService.getTrips();
  }
}
