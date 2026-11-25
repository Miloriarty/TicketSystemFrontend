import { Component, computed, input, model, output, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatInput, MatLabel, MatPrefix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../core/models/category.model';

@Component({
  imports: [
    MatButton,
    MatCard,
    MatCardActions,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatPrefix,
    FormsModule,
  ],
  selector: 'app-categories-card',
  styleUrl: './categories-card.component.scss',
  templateUrl: './categories-card.component.html',
})
export class CategoriesCardComponent {
  categories = input.required<Category[]>();

  create = output<string>();
  delete = output<Category>();

  newCategory = model<string>('');

  searchCategory = signal<string>('');
  filteredCategories = computed(() => {
    const query = this.searchCategory().trim().toLowerCase();
    return this.categories().filter((c) => c.name.toLowerCase().includes(query));
  });

  protected onSearchCategoryChange(text: string) {
    this.searchCategory.set(text);
  }

  protected canCreateCategory = computed(() => {
    return this.newCategory().trim().length > 0 && !this.isCategoryExists();
  });

  protected isCategoryExists = computed(() => {
    const name = this.newCategory().trim().toLowerCase();
    return this.categories().some((c) => c.name.trim().toLowerCase() === name);
  });
}
