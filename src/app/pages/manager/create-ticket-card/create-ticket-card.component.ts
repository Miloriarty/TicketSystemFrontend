import { Component, computed, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';

import { NamesByIdsPipe } from '../../../shared/pipes/names-by-ids.pipe';
import { Category } from '../../../core/models/category.model';
import { Employee } from '../../../core/models/employee.model';

@Component({
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSelectTrigger,
    NamesByIdsPipe,
  ],
  selector: 'app-create-ticket-card',
  styleUrl: './create-ticket-card.component.scss',
  templateUrl: './create-ticket-card.component.html',
})
export class CreateTicketCardComponent {
  employees = input.required<Employee[]>();
  categories = input.required<Category[]>();
  editingTicketId = input<number | null>(null);
  
  title = model<string>('');
  description = model<string>('');
  selectedCategories = model<Category[]>([]);
  selectedEmployees = model<Employee[]>([]);

  save = output<void>();
  cancel = output<void>();

  protected isEditing = computed(() => this.editingTicketId() !== null);

  protected categorySelected = computed(() => this.selectedCategories().length > 0);

  protected filteredEmployees = computed(() => {
    const ids = this.selectedCategories().map((c) => c.id);
    return this.employees().filter((e) => e.categoryIds.some((id) => ids.includes(id)));
  });

  protected employeeNames = computed(() =>
    this.selectedEmployees()
      .map((e) => e.fullName)
      .join(', '),
  );

  protected isAllCategoriesCovered = computed(() => {
    const categoryIds = this.selectedCategories().map((c) => c.id);
    const employeeCategoryIds = new Set(this.selectedEmployees().flatMap((e) => e.categoryIds));
    if (categoryIds.length === 0) return false;

    return categoryIds.every((c) => employeeCategoryIds.has(c));
  });

  protected canCreateTicket = computed(
    () =>
      this.title().trim().length > 0 &&
      this.description().trim().length > 0 &&
      this.isAllCategoriesCovered(),
  );

  protected canCancel = computed(
    () =>
      this.title().length > 0 ||
      this.description().length > 0 ||
      this.selectedCategories().length > 0 ||
      this.selectedEmployees().length > 0,
  );
}
