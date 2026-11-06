import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { RegistrationService } from '../services/registration.service';
import { PreferencesService } from '../services/preferences.service';

export function jordanianPhoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const sanitized = String(control.value).replace(/[\s-]/g, '');
  const isJordanianMobile = /^(?:\+962|00962|0)?7[789]\d{7}$/.test(sanitized);
  return isJordanianMobile ? null : { invalidJordanianPhone: true };
}

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!password || !confirmPassword) {
    return null;
  }
  return password === confirmPassword ? null : { passwordMismatch: true };
}

const STRICT_EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

@Component({
  selector: 'app-parent-registration',
  imports: [ReactiveFormsModule, RouterLink, NgOptimizedImage],
  templateUrl: './parent-registration.html',
  styleUrl: './parent-registration.css',
})
export class ParentRegistration {
  protected readonly prefs = inject(PreferencesService);
  protected readonly t = this.prefs.t;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly registrationService = inject(RegistrationService);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly isSubmitting = signal<boolean>(false);

  protected readonly registerForm = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(STRICT_EMAIL_PATTERN)]],
      phone: ['', [Validators.required, jordanianPhoneValidator]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      canManageChildrenTransport: [true],
      initialChildName: [''],
    },
    {
      validators: [passwordMatchValidator],
    }
  );

  protected isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return Boolean(control && control.invalid && (control.dirty || control.touched));
  }

  protected isPasswordMismatch(): boolean {
    const confirmCtrl = this.registerForm.get('confirmPassword');
    return Boolean(
      confirmCtrl &&
      (confirmCtrl.dirty || confirmCtrl.touched) &&
      this.registerForm.hasError('passwordMismatch')
    );
  }

  protected onSubmit(): void {
    this.errorMessage.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage.set(this.t().regGenericError);
      return;
    }

    this.isSubmitting.set(true);

    const formValues = this.registerForm.getRawValue();
    const result = this.registrationService.registerParent({
      fullName: formValues.fullName,
      email: formValues.email,
      phone: formValues.phone,
      address: formValues.address,
      password: formValues.password,
      canManageChildrenTransport: formValues.canManageChildrenTransport,
      initialChildName: formValues.initialChildName,
    });

    if (!result.success) {
      this.errorMessage.set(this.t().regDuplicateEmailError);
      this.isSubmitting.set(false);
      return;
    }

    this.successMessage.set(this.t().regSuccess);
    setTimeout(() => {
      void this.router.navigate(['/login']);
    }, 1200);
  }
}
