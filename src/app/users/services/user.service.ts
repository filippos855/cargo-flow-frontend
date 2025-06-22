import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AppConfigService } from '../../core/services/app-config.service';
import { Person } from '../../persons/models/person.model';
import { DictionaryItem } from '../../shared/models/dictionary-item.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) {
    this.baseUrl = `${this.config.apiUrl}/users`;
  }

  getUsers(
    search = '',
    sort = 'username',
    direction: 'asc' | 'desc' = 'asc',
    page = 1,
    pageSize = 10,
    isActive?: boolean
  ): Observable<{ items: User[]; totalCount: number }> {
    let params = new HttpParams()
      .set('search', search)
      .set('sort', sort)
      .set('direction', direction)
      .set('page', page)
      .set('pageSize', pageSize);

    if (isActive !== undefined) {
      params = params.set('isActive', isActive ? 'true' : 'false');
    }

    return this.http.get<{ items: User[]; totalCount: number }>(this.baseUrl, { params });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  addUser(user: {
    username: string;
    password: string;
    role: DictionaryItem;
    person: Person;
    isActive: boolean;
  }): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  updateUser(user: {
    id: number;
    username: string;
    password?: string;
    role: DictionaryItem;
    person: Person;
    isActive: boolean;
  }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${user.id}`, user);
  }

  deleteUserById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
