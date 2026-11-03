import {Component, inject, signal} from '@angular/core';
import {MatFormField, MatInput, MatLabel, MatSuffix} from '@angular/material/input';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {AuthService} from '../../core/services/auth.service';
import {LoginRequest} from '../../core/models/auth.model';
import {Router} from '@angular/router';
import {homeFor} from '../../core/guards';

@Component({
  imports: [
    MatLabel,
    MatFormField,
    MatCard,
    MatInput,
    MatIcon,
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
    MatCardContent,
    FormsModule,
    MatIconButton,
    MatSuffix,
    MatCardActions,
    MatButton
  ],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginService = inject(AuthService);
  router = inject(Router);

  login = signal<string>('');
  password = signal<string>('');
  hidePassword = signal<boolean>(true)

  protected canCancel(): boolean {
    return this.login().length > 0 || this.password().length > 0;
  }

  protected canLogin(): boolean {
    return this.login().length > 0 && this.password().length > 0;
  }

  protected tryLogin() {
    let request: LoginRequest = {
      fullName: this.login(),
      password: this.password()
    }
    this.loginService.login(request).subscribe({
      next: user => {
        console.log("Login successfully: ", user);
        this.loginService.user.set(user);
        this.router.navigateByUrl(homeFor(user.role));
      },
      error: e => {
        console.error("Login failed: ", e);
      }
    })
  }

  protected clearForm(): void {
    this.login.set('');
    this.password.set('');
    this.hidePassword.set(true);
  }
}
