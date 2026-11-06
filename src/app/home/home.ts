import { Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { PreferencesService } from '../services/preferences.service';

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, RouterLink, Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly prefs = inject(PreferencesService);
  protected readonly t = this.prefs.t;

  protected readonly serviceList = computed(() => this.t().serviceList);
  protected readonly infoCards = computed(() => this.t().infoCards);

  protected readonly officeDetails = computed(() => ({
    name: this.t().officeName,
    location: this.t().officeLocationVal,
    workingHours: this.t().officeHoursVal,
    phone: '+962 6 500 0000',
    emergencyHelpline: '+962 79 000 0000',
    email: 'transport@basi.edu',
  }));
}
