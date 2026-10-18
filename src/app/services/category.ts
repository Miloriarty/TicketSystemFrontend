import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  employeesId: Array<number>,
  ticketsId: Array<number>
}

export interface CategoryRequest {
  name: string;
}


@Service()
export class CategoryService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = 'http://localhost:5042/api/categories';

  public getCategories() : Observable<Category[]> {
    return this.client.get<Category[]>(this.apiUrl);
  }

  public createCategory(cat: CategoryRequest): Observable<Category> {
    return this.client.post<Category>(this.apiUrl, cat);
  }

  public updateCategory(cat: CategoryRequest): Observable<Category> {
    return this.client.put<Category>(this.apiUrl, cat);
  }
}
