import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

/**
 * The login page. A simple form that calls AuthService.login and, on success,
 * navigates to the dashboard. On failure it shows an error message.
 */
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  submit(): void {
    this.error.set(null);
    this.loading.set(true);
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err?.error?.message ?? 'Login failed. Check your email and password.',
        );
      },
    });
  }
}
