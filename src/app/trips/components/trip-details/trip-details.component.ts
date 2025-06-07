import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss']
})
export class TripDetailsComponent implements OnInit {
  trip$!: Observable<Trip | null>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private tripService: TripService
  ) {}

  ngOnInit(): void {
    this.trip$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.tripService.getTripById(id);
      })
    );
  }

  goBack(): void {
    this.location.back();
  }
}
