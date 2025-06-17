import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DictionaryItem } from '../models/dictionary-item.model';
import { AppConfigService } from '../../core/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryItemsService {
  private baseUrl: string;

  constructor(private http: HttpClient, private config: AppConfigService) {
    this.baseUrl = `${this.config.apiUrl}/dictionaryitems`;
  }

  getDictionaryItemsByName(dictionaryName: string): Observable<DictionaryItem[]> {
    const params = new HttpParams().set('dictionaryName', dictionaryName);
    return this.http.get<DictionaryItem[]>(`${this.baseUrl}`, { params });
  }
}
