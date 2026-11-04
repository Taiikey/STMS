import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

interface TransportService {
  readonly title: string;
  readonly description: string;
  readonly fee: number;
  readonly feeUnit: string;
  readonly serviceAreas: readonly string[];
  readonly conditions: readonly string[];
  readonly iconSrc: string;
  readonly iconAlt: string;
  readonly width: number;
  readonly height: number;
}

interface GeneralCondition {
  readonly title: string;
  readonly text: string;
}

@Component({
  selector: 'app-transport',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './transport.html',
  styleUrl: './transport.css',
})
export class Transport {
  protected readonly isMenuOpen = signal(false);

  // Sample data. Replace with data from the API once the backend is ready.
  protected readonly services = signal<readonly TransportService[]>([
    {
      title: 'Round-Trip Transportation',
      description:
        'Morning pickup from your stop and afternoon return home, with a reserved seat for the whole subscription period.',
      fee: 40,
      feeUnit: 'JOD per month',
      serviceAreas: ['North Amman', 'West Amman', 'Downtown'],
      conditions: [
        'Subscription is valid for one school term.',
        'Student must be registered under a parent or guardian account.',
        'Subject to seat availability on the chosen route.',
      ],
      iconSrc: 'shool_bus.png',
      iconAlt: 'School bus icon',
      width: 88,
      height: 56,
    },
    {
      title: 'One-Way Transportation',
      description:
        'Choose either the morning pickup or the afternoon drop-off if your child only needs one direction.',
      fee: 25,
      feeUnit: 'JOD per month',
      serviceAreas: ['North Amman', 'West Amman', 'East Amman'],
      conditions: [
        'Direction (pickup or drop-off) is selected at subscription time.',
        'Changing direction requires a modification request.',
        'Subject to seat availability on the chosen route.',
      ],
      iconSrc: 'watch.png',
      iconAlt: 'Schedule watch icon',
      width: 58,
      height: 72,
    },
    {
      title: 'After School Activity Shuttle',
      description:
        'Later afternoon departures for students joining clubs, sports training, and extracurricular programs.',
      fee: 15,
      feeUnit: 'JOD per month',
      serviceAreas: ['West Amman', 'Downtown'],
      conditions: [
        'Available only on days with scheduled activities.',
        'Requires an active main transportation subscription.',
        'Pickup stop is the same as the main route.',
      ],
      iconSrc: 'pin.png',
      iconAlt: 'Location pin icon',
      width: 60,
      height: 72,
    },
  ]);

  protected readonly generalConditions = signal<readonly GeneralCondition[]>([
    {
      title: 'Registration Required',
      text: 'Parents or guardians must register an account and add each student before subscribing.',
    },
    {
      title: 'Approval by Administration',
      text: 'Every subscription request is reviewed and approved or rejected by the transportation office.',
    },
    {
      title: 'Payments',
      text: 'Payment status is recorded by the school administration. No online payment is processed on this site.',
    },
    {
      title: 'Cancellation and Changes',
      text: 'Cancellation or modification requests can be submitted from the My Transportation page according to school rules.',
    },
  ]);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}

