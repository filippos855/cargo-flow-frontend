import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FleetVehicle } from '../models/fleet-vehicle.model';
import { AppConfigService } from '../../core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class FleetService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.baseUrl = `${this.config.apiUrl}/fleetvehicles`;
  }

  getFleet(
    search = '',
    sort = 'identifier',
    direction: 'asc' | 'desc' = 'asc',
    page = 1,
    pageSize = 10,
    itpExpired?: boolean,
    rcaExpired?: boolean,
    isAvailable?: boolean
  ): Observable<{ items: FleetVehicle[]; totalCount: number }> {
    let params = new HttpParams()
      .set('search', search)
      .set('sort', sort)
      .set('direction', direction)
      .set('page', page)
      .set('pageSize', pageSize);

    if (itpExpired) params = params.set('itpExpired', 'true');
    if (rcaExpired) params = params.set('rcaExpired', 'true');
    if (isAvailable) params = params.set('isAvailable', 'true');

    return this.http.get<{ items: FleetVehicle[]; totalCount: number }>(this.baseUrl, { params });
  }

  getVehicleById(id: number): Observable<FleetVehicle> {
    return this.http.get<FleetVehicle>(`${this.baseUrl}/${id}`);
  }

  addVehicle(vehicle: FleetVehicle): Observable<FleetVehicle> {
    return this.http.post<FleetVehicle>(this.baseUrl, vehicle);
  }

  updateVehicle(vehicle: FleetVehicle): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${vehicle.id}`, vehicle);
  }

  deleteVehicleById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
