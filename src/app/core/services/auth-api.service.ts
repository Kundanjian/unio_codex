import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = 'http://localhost:8080/auth';

  login(username: string, password: string): Observable<string> {
    return this.http.post(`${this.apiBase}/login`, { username, password }, { responseType: 'text' });
  }
}
