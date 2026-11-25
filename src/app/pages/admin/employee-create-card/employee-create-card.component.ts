import { Component, computed, input, model, output } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';

import { Role, ROLES } from '../../../core/models/role.model';
import { Category } from '../../../core/models/category.model';

@Component({
  imports: [
    MatCard,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    FormsModule,
    MatButton,
    MatCardActions,
  ],
  selector: 'app-employee-create-card',
  styleUrl: './employee-create-card.component.scss',
  templateUrl: './employee-create-card.component.html',
})
export class EmployeeCreateCardComponent {
  categories = input.required<Category[]>();
  editingEmployeeId = input<number | null>(null);

  fullName = model<string>('');
  position = model<string>('');
  password = model<string>('');
  selectedRole = model<Role | null>(null);
  selectedCategories = model<Category[]>([]);

  save = output<void>();
  cancel = output<void>();

  protected readonly roles = ROLES;

  protected isEditing = computed(() =>
    this.editingEmployeeId() !== null
  );

  protected roleHasCategories = computed(() =>
    this.haveCategories(this.selectedRole())
  );

  protected canCreateEmployee = computed(
    () =>
      this.fullName().trim().length > 0 &&
      this.position().trim().length > 0 &&
      this.selectedRole() !== null &&
      (this.isEditing() || this.password().trim().length > 0) &&
      (!this.roleHasCategories() || this.selectedCategories().length > 0),
  );

  protected canCancelEmployee = computed(() =>
      this.fullName().trim().length > 0 ||
      this.position().trim().length > 0 ||
      this.selectedCategories().length > 0 ||
      this.selectedRole() !== null,
  );

  protected onRoleChange(role: Role) {
    this.selectedRole.set(role);
    if (!this.haveCategories(role)) this.selectedCategories.set([]);
  }

  private haveCategories(role: Role | null) {
    return role === 'employee';
  }
}
