import {inject, Service} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_URL} from '../api';
import {Employee, EmployeeRequest} from '../models/employee';

@Service()
export class EmployeeService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = `${API_URL}/employees`;

  public getEmployees(): Observable<Employee[]> {
    return this.client.get<Employee[]>(this.apiUrl);
  }

  public createEmployee(employee: EmployeeRequest): Observable<Employee> {
    return this.client.post<Employee>(this.apiUrl, employee);
  }

  public editEmployee(id: number, employee: EmployeeRequest): Observable<Employee> {
    return this.client.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  public deleteEmployee(id: number): Observable<void> {
    return this.client.delete<void>(`${this.apiUrl}/${id}`);
  }
}
