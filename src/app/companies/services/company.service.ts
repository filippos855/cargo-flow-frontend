import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';
import { AppConfigService } from '../../core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.baseUrl = `${this.config.apiUrl}/companies`;
  }

  getCompanies(
    search = '',
    sort = 'name',
    direction: 'asc' | 'desc' = 'asc',
    page = 1,
    pageSize = 10
  ): Observable<{ items: Company[]; totalCount: number }> {
    let params = new HttpParams()
      .set('search', search)
      .set('sort', sort)
      .set('direction', direction)
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<{ items: Company[]; totalCount: number }>(this.baseUrl, { params });
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/${id}`);
  }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.baseUrl, company);
  }

  updateCompany(company: Company): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${company.id}`, company);
  }

  deleteCompanyById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
