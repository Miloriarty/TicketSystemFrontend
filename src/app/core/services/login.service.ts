import {inject, Service} from '@angular/core';
import { LoginRequest } from '../models/login.model';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../api';
import {Observable} from 'rxjs';
import {Employee} from '../models/employee.model';


@Service()
export class LoginService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = `${API_URL}/login`;

  public login(request: LoginRequest): Observable<Employee> {
    return this.client.post<Employee>(this.apiUrl, request)
  }
}
