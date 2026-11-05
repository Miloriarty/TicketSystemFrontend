import {afterNextRender, Component, ElementRef, inject, signal, viewChild} from '@angular/core';
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
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';

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
  styleUrl: './login.component.scss',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginService = inject(AuthService);
  router = inject(Router);
  _snackBar = inject(MatSnackBar);

  login = signal<string>('');
  password = signal<string>('');
  hidePassword = signal<boolean>(true);

  private loginInput = viewChild
    .required<ElementRef<HTMLInputElement>>('loginInput')

  constructor() {
    afterNextRender(() => this.loginInput().nativeElement.focus());
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
        console.warn("Login failed: ", e);
        this.showShackBar(this.loginErrorMessage(e));
      }
    })
  }

  private loginErrorMessage(e: HttpErrorResponse): string {
    switch (e.status) {
      case 404: return 'User not found';
      case 401: return 'Incorrect password';
      case 0:   return 'Server is down';
      default:  return 'Failed to login';
    }
  }

  protected showShackBar(error: string): void {
    this._snackBar.open(error, "Ok", {
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center"
    });
  }
}
