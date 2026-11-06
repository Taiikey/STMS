import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PreferencesService } from '../services/preferences.service';

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly prefs = inject(PreferencesService);
  protected readonly t = this.prefs.t;

  protected readonly isMenuOpen = signal(false);

  protected readonly serviceList = computed(() => this.t().serviceList);
  protected readonly infoCards = computed(() => this.t().infoCards);

  protected readonly officeDetails = computed(() => ({
    name: this.t().officeName,
    location: this.t().officeLocationVal,
    workingHours: this.t().officeHoursVal,
    phone: '+962 7854 57267',
    emergencyHelpline: '+966 50 123 4567',
    email: 'Saleh_Alhkhatib@outlook.com',
  }));

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
