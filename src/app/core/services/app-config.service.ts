import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  readonly apiUrl = 'http://localhost:5289/api';
}
