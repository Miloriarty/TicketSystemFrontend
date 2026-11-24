import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../api';
import { Category, CategoryRequest } from '../models/category.model';

@Service()
export class CategoryService {
  private readonly client = inject<HttpClient>(HttpClient);
  private readonly apiUrl = `${API_URL}/categories`;

  getCategories(): Observable<Category[]> {
    return this.client.get<Category[]>(this.apiUrl);
  }

  createCategory(cat: CategoryRequest): Observable<Category> {
    return this.client.post<Category>(this.apiUrl, cat);
  }

  deleteCategory(id: number): Observable<void> {
    return this.client.delete<void>(`${this.apiUrl}/${id}`);
  }
}
