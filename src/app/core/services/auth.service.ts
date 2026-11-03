import {inject, Service, signal} from '@angular/core';
import {AuthUser, LoginRequest} from '../models/auth.model';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../api';
import {catchError, Observable, of, tap} from 'rxjs';


@Service()
export class AuthService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = `${API_URL}/login`;
  readonly user = signal<AuthUser | null>(null);


  public login(request: LoginRequest): Observable<AuthUser> {
    return this.client.post<AuthUser>(this.apiUrl, request)
  }

  public loadMe(): Observable<AuthUser | null> {
    return this.client.get<AuthUser>(`${API_URL}/login/me`).pipe(
      tap(u => this.user.set(u)),
      catchError(() => { this.user.set(null); return of(null); }),
    );
  }

  public logout(): Observable<void> {
    return this.client.post<void>(`${this.apiUrl}/logout`, {})
  }
}
