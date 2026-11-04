
import { Component, computed, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

interface RouteStop {
  readonly name: string;
  readonly pickupTime: string;
}

interface SchoolRoute {
  readonly id: number;
  readonly routeNumber: string;
  readonly routeName: string;
  readonly serviceArea: string;
  readonly startingPoint: string;
  readonly destination: string;
  readonly pickupTime: string;
  readonly dropoffTime: string;
  readonly stops: readonly RouteStop[];
}

@Component({
  selector: 'app-routes',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './routes.html',
  styleUrl: './routes.css',
})
export class Routes {
  protected readonly isMenuOpen = signal(false);
  protected readonly searchTerm = signal('');
  protected readonly selectedArea = signal('All');
  protected readonly selectedRouteId = signal<number | null>(null);

  protected readonly routes = signal<readonly SchoolRoute[]>([
    {
      id: 1,
      routeNumber: 'R101',
      routeName: 'North Amman Route',
      serviceArea: 'North Amman',
      startingPoint: 'Abu Nseir',
      destination: 'Basi School',
      pickupTime: '6:45 AM',
      dropoffTime: '2:45 PM',
      stops: [
        { name: 'Abu Nseir Circle', pickupTime: '6:45 AM' },
        { name: 'Shafa Badran', pickupTime: '6:55 AM' },
        { name: 'University Street', pickupTime: '7:10 AM' },
        { name: 'Basi School', pickupTime: '7:30 AM' },
      ],
    },
    {
      id: 2,
      routeNumber: 'R102',
      routeName: 'West Amman Route',
      serviceArea: 'West Amman',
      startingPoint: 'Khalda',
      destination: 'Basi School',
      pickupTime: '6:50 AM',
      dropoffTime: '2:40 PM',
      stops: [
        { name: 'Khalda Circle', pickupTime: '6:50 AM' },
        { name: 'Tla Al-Ali', pickupTime: '7:00 AM' },
        { name: 'Dabouq', pickupTime: '7:12 AM' },
        { name: 'Basi School', pickupTime: '7:30 AM' },
      ],
    },
    {
      id: 3,
      routeNumber: 'R103',
      routeName: 'Downtown Route',
      serviceArea: 'Downtown',
      startingPoint: 'Ras Al-Ain',
      destination: 'Basi School',
      pickupTime: '6:40 AM',
      dropoffTime: '2:50 PM',
      stops: [
        { name: 'Ras Al-Ain', pickupTime: '6:40 AM' },
        { name: 'Downtown Amman', pickupTime: '6:50 AM' },
        { name: 'Jabal Amman', pickupTime: '7:05 AM' },
        { name: 'Basi School', pickupTime: '7:30 AM' },
      ],
    },
    {
      id: 4,
      routeNumber: 'R104',
      routeName: 'East Amman Route',
      serviceArea: 'East Amman',
      startingPoint: 'Marka',
      destination: 'Basi School',
      pickupTime: '6:40 AM',
      dropoffTime: '2:45 PM',
      stops: [
        { name: 'Marka', pickupTime: '6:40 AM' },
        { name: 'Prince Hamzah Hospital Area', pickupTime: '6:55 AM' },
        { name: 'Tabarbour', pickupTime: '7:10 AM' },
        { name: 'Basi School', pickupTime: '7:30 AM' },
      ],
    },
    {
      id: 5,
      routeNumber: 'R105',
      routeName: 'South Amman Route',
      serviceArea: 'South Amman',
      startingPoint: 'Naour',
      destination: 'Basi School',
      pickupTime: '6:35 AM',
      dropoffTime: '2:50 PM',
      stops: [
        { name: 'Naour', pickupTime: '6:35 AM' },
        { name: 'Marj Al-Hamam', pickupTime: '6:50 AM' },
        { name: 'Airport Road', pickupTime: '7:05 AM' },
        { name: 'Basi School', pickupTime: '7:30 AM' },
      ],
    },
    {
      id: 6,
      routeNumber: 'R106',
      routeName: 'University Street Route',
      serviceArea: 'North Amman',
      startingPoint: 'Jubaiha',
      destination: 'Basi School',
      pickupTime: '6:50 AM',
      dropoffTime: '2:40 PM',
      stops: [
        { name: 'Jubaiha', pickupTime: '6:50 AM' },
        { name: 'Jordan University Gate', pickupTime: '7:00 AM' },
        { name: 'University Street', pickupTime: '7:12 AM' },
        { name: 'Basi School', pickupTime: '7:30 AM' },
      ],
    },
  ]);

  protected readonly serviceAreas = computed(() => [
    ...new Set(this.routes().map((route) => route.serviceArea)),
  ].sort());

  protected readonly filteredRoutes = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const area = this.selectedArea();

    return this.routes().filter((route) => {
      const matchesSearch =
        route.routeName.toLowerCase().includes(search) ||
        route.routeNumber.toLowerCase().includes(search);

      const matchesArea = area === 'All' || route.serviceArea === area;

      return matchesSearch && matchesArea;
    });
  });

  protected updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  protected updateArea(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedArea.set(select.value);
  }

  protected resetFilters(): void {
    this.searchTerm.set('');
    this.selectedArea.set('All');
  }

  protected toggleDetails(routeId: number): void {
    this.selectedRouteId.update((currentId) =>
      currentId === routeId ? null : routeId
    );
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
