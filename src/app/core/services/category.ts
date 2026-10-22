import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api';
import { Category, CategoryRequest } from '../models/category';

@Service()
export class CategoryService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = `${API_URL}/categories`;

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
