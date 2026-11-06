import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { RegistrationService } from '../services/registration.service';
import { PreferencesService } from '../services/preferences.service';

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

  protected readonly registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    canManageChildrenTransport: [true],
    initialChildName: [''],
  });

  protected isFieldInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return Boolean(control && control.invalid && (control.dirty || control.touched));
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
