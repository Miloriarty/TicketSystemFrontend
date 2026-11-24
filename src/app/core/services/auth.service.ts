import { inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

import { AuthUser, LoginRequest } from '../models/auth.model';
import { API_URL } from '../api';

@Service()
export class AuthService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = `${API_URL}/login`;
  readonly user = signal<AuthUser | null>(null);

  login(request: LoginRequest): Observable<AuthUser> {
    return this.client.post<AuthUser>(this.apiUrl, request);
  }

  loadMe(): Observable<AuthUser | null> {
    return this.client.get<AuthUser>(`${API_URL}/login/info`).pipe(
      tap((u) => this.user.set(u)),
      catchError(() => {
        this.user.set(null);
        return of(null);
      }),
    );
  }

  logout(): Observable<void> {
    return this.client.post<void>(`${this.apiUrl}/logout`, {});
  }
}
