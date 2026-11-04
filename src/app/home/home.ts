import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

interface TransportService {
  readonly title: string;
  readonly description: string;
  readonly iconSrc: string;
  readonly iconAlt: string;
  readonly width: number;
  readonly height: number;
}

interface InformationCard {
  readonly title: string;
  readonly category: string;
  readonly points: readonly string[];
}

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly isMenuOpen = signal(false);

  protected readonly serviceList = signal<readonly TransportService[]>([
    {
      title: 'Daily Student Commute',
      description:
        'Punctual morning pickup and afternoon return covering designated residential routes with assigned seats.',
      iconSrc: 'shool_bus.png',
      iconAlt: 'School bus icon',
      width: 88,
      height: 56,
    },
    {
      title: 'After School Activity Shuttles',
      description:
        'Scheduled transport for students participating in clubs, sports training, and extracurricular programs.',
      iconSrc: 'watch.png',
      iconAlt: 'Schedule watch icon',
      width: 58,
      height: 72,
    },
    {
      title: 'Fleet Tracking and Notifications',
      description:
        'Live transit monitoring and automated arrival notifications for parents and school administration.',
      iconSrc: 'pin.png',
      iconAlt: 'Location tracking pin icon',
      width: 60,
      height: 72,
    },
  ]);

  protected readonly infoCards = signal<readonly InformationCard[]>([
    {
      title: 'Routes and Schedules',
      category: 'Routes',
      points: [
        'Designated community stops configured to minimize student transit time.',
        'Morning student arrival at campus by 7:30 AM; afternoon departures begin at 3:15 PM.',
        'Live route adjustments communicated proactively during heavy traffic.',
      ],
    },
    {
      title: 'Transportation Arrangements',
      category: 'Arrangements',
      points: [
        'Dedicated seat assignments ensure every student has a reserved place.',
        'Certified bus supervisors accompany each vehicle to assist students.',
        'Parent requests for temporary route switches or leaves processed via portal.',
      ],
    },
    {
      title: 'Safety Procedures',
      category: 'Safety',
      points: [
        'Mandatory seat belt policy and supervised boarding and disembarking.',
        'Certified drivers with regular defensive driving evaluations.',
        'Daily vehicle safety inspections and direct emergency dispatch radio line.',
      ],
    },
  ]);

  protected readonly officeDetails = signal({
    name: 'Basi School Transportation Office',
    location: 'Main Administration Building, Ground Floor, Suite 104',
    workingHours: 'Sunday to Thursday from 7:00 AM to 3:30 PM',
    phone: '+962 7854 57267',
    emergencyHelpline: '+966 50 123 4567',
    email: 'Saleh_Alhkhatib@outlook.com',
  });

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
