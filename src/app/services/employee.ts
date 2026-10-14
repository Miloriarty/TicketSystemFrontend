import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Employee {
  id: number;
  fullName: string;
  position: string;
  startDate: Date;
  roleId: number;
  categoriesId: Array<number>;
  TicketsId: number;
}

@Service()
export class EmployeeService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = "http://localhost:5042/api/employees";

  public getEmployees() : Observable<Employee[]> {
    return this.client.get<Employee[]>(this.apiUrl);
  }
}
