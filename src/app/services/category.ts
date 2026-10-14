import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  employeesId: Array<number>,
  ticketsId: Array<number>
}


@Service()
export class CategoryService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = 'http://localhost:5042/api/categories';

  public getCategories() : Observable<Category[]> {
    return this.client.get<Category[]>(this.apiUrl);
  }
}
