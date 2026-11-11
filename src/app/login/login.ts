import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { AuthService } from '../services/auth.service';
import { PreferencesService } from '../services/preferences.service';

const STRICT_EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, Header],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected readonly prefs = inject(PreferencesService);
  protected readonly t = this.prefs.t;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly isSubmitting = signal<boolean>(false);

  protected readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.pattern(STRICT_EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return Boolean(control && control.invalid && (control.dirty || control.touched));
  }

  protected onSubmit(): void {
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set(this.t().loginGenericError);
      return;
    }

    this.isSubmitting.set(true);

    const formValues = this.loginForm.getRawValue();

    this.authService
      .login({
        email: formValues.email,
        password: formValues.password,
      })
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.successMessage.set(this.t().loginSuccess);
          setTimeout(() => {
            void this.router.navigate(['/']);
          }, 1200);
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting.set(false);
          if (err.status === 401) {
            this.errorMessage.set(this.t().loginInvalidCredentialsError);
          } else if (err.status === 0) {
            this.errorMessage.set(this.t().serverConnectionError);
          } else if (err.error && typeof err.error === 'object' && 'message' in err.error) {
            this.errorMessage.set(String(err.error.message));
          } else {
            this.errorMessage.set(this.t().loginGenericError);
          }
        },
      });
  }
}

