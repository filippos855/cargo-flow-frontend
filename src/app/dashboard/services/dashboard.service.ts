import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  activeTrips: number;
  expiringFleet: number;
  unpaidInvoices: number;
  activeClients: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.baseUrl = `${this.config.apiUrl}/dashboard`;
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.baseUrl);
  }
}
