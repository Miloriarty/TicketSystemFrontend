import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


export interface Role {
  id: number;
  name: string;
  employeesId: Array<number>
}

@Service()
export class RoleService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = "http://localhost:5042/api/roles";

  public getRoles() : Observable<Role[]> {
    return this.client.get<Role[]>(this.apiUrl)
  }
}
