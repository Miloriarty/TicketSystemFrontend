import {Component, computed, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../core/services/auth.service';
import {httpErrorMessage} from '../../core/http-error';


interface NAV_LINK {
  path: string;
  icon: string;
  label: string;
  roles: string[];
}

const NAV_LINKS: NAV_LINK[] = [
  { path: '/manager', icon: 'add_task', label: 'Manager', roles: ['manager'] },
  { path: '/admin', icon: 'confirmation_number', label: 'Admin', roles: ['admin'] },
  { path: '/employees', icon: 'people', label: 'Employees', roles: ['employee'] },
]

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css',
})
export class AppHeader {
  private readonly loginService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  user = this.loginService.user;

  protected readonly links = computed(() => {
    let role = this.user()?.role;
    return role ? NAV_LINKS.filter((link) => link.roles.includes(role)) : [];
  })

  protected logout(): void {
    this.loginService.logout().subscribe({
        next: () => {
          this.loginService.user.set(null);
          this.router.navigate(['/login']);
        },
        error: err => {
          console.error("Failed to log out: ", err);
          this.snackBar.open(httpErrorMessage(err, 'log out'), 'Ok', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        },
      }
    )
  }
}
