import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip.model';
import { AppConfigService } from '../../core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.baseUrl = `${this.config.apiUrl}/trips`;
  }

  getTrips(
    search = '',
    sort = 'startDate',
    direction: 'asc' | 'desc' = 'asc',
    page = 1,
    pageSize = 15,
    startDateFrom?: string,
    startDateTo?: string
  ): Observable<{ items: Trip[]; totalCount: number }> {
    let params = new HttpParams()
      .set('search', search)
      .set('sort', sort)
      .set('direction', direction)
      .set('page', page)
      .set('pageSize', pageSize);

    if (startDateFrom) params = params.set('startDateFrom', startDateFrom);
    if (startDateTo) params = params.set('startDateTo', startDateTo);

    return this.http.get<{ items: Trip[]; totalCount: number }>(this.baseUrl, { params });
  }

  getTripById(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.baseUrl}/${id}`);
  }

  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.baseUrl, trip);
  }

  updateTrip(trip: Trip): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${trip.id}`, trip);
  }

  deleteTripById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addOrderToTrip(tripId: number, orderId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${tripId}/add-order/${orderId}`, {});
  }

  removeOrderFromTrip(tripId: number, orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${tripId}/remove-order/${orderId}`);
  }
}