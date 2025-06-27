import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice.model';
import { AppConfigService } from '../../core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.baseUrl = `${this.config.apiUrl}/invoices`;
  }

  getInvoices(
    search = '',
    sort = 'issueDate',
    direction: 'desc' | 'asc' = 'desc',
    page = 1,
    pageSize = 10,
    startDateFrom?: string,
    startDateTo?: string
  ): Observable<{ items: Invoice[]; totalCount: number }> {
    let params = new HttpParams()
      .set('search', search)
      .set('sort', sort)
      .set('direction', direction)
      .set('page', page)
      .set('pageSize', pageSize);

    if (startDateFrom) params = params.set('startDateFrom', startDateFrom);
    if (startDateTo) params = params.set('startDateTo', startDateTo);

    return this.http.get<{ items: Invoice[]; totalCount: number }>(this.baseUrl, { params });
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.baseUrl}/${id}`);
  }

  addInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.baseUrl, invoice);
  }

  updateInvoice(invoice: Invoice): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${invoice.id}`, invoice);
  }

  deleteInvoiceById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}