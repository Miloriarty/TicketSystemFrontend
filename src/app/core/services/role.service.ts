import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_URL} from '../api';
import {Role} from '../models/role.model';

@Service()
export class RoleService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = `${API_URL}/roles`;

  public getRoles() : Observable<Role[]> {
    return this.client.get<Role[]>(this.apiUrl)
  }
}
