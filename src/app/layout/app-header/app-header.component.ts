import {Component, inject} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {LoginService} from '../../core/services/login.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.css',
})
export class AppHeader {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.loginService.logout().subscribe({
        next: () => this.router.navigate(['/login']),
        error: err => console.error("Failed to log out: ", err),
      }
    )
  }
}
