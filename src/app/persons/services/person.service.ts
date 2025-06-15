import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Person } from '../models/person.model';
import { Observable } from 'rxjs';
import { AppConfigService } from '../../core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.baseUrl = `${this.config.apiUrl}/persons`;
  }

  getPersons(
    search = '',
    sort = 'fullName',
    direction: 'asc' | 'desc' = 'asc',
    page = 1,
    pageSize = 10
  ): Observable<{ items: Person[]; totalCount: number }> {
    let params = new HttpParams()
      .set('search', search)
      .set('sort', sort)
      .set('direction', direction)
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<{ items: Person[]; totalCount: number }>(this.baseUrl, { params });
  }

  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}/${id}`);
  }

  addPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.baseUrl, person);
  }

  updatePerson(person: Person): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${person.id}`, person);
  }

  deletePersonById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
