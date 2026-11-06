import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { PreferencesService } from '../services/preferences.service';

interface RouteStop {
  readonly name: string;
  readonly pickupTime: string;
  readonly dropoffTime: string;
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
  readonly assignedBus: string | null;
  readonly assignedDriver: string | null;
  readonly capacity: number;
  readonly enrolledStudents: number;
  readonly isActive: boolean;
}

@Component({
  selector: 'app-routes',
  imports: [NgOptimizedImage, RouterLink, Header],
  templateUrl: './routes.html',
  styleUrl: './routes.css',
})
export class Routes {
  protected readonly prefs = inject(PreferencesService);

  protected readonly isArabic = computed(
    () => this.prefs.lang() === 'ar'
  );

  protected readonly isMenuOpen = signal(false);
  protected readonly searchTerm = signal('');
  protected readonly selectedArea = signal('All');
  protected readonly selectedRouteId = signal<number | null>(null);

  private readonly arabicText: Record<string, string> = {
    // Hero
    'School Routes and Stops': 'مسارات الحافلات المدرسية ومحطاتها',
    'Find school transportation routes, their stops, and pickup times.':
      'تعرّف على مسارات النقل المدرسي ومحطاتها ومواعيد الاصطحاب.',
    'View Services': 'عرض الخدمات',

    // Routes section
    'Available Routes': 'المسارات المتاحة',
    'Search by route name or number and select your service area.':
      'ابحث باسم المسار أو رقمه وحدد منطقة الخدمة.',
    'Search Routes': 'البحث عن المسارات',
    'Enter route name or number': 'أدخل اسم المسار أو رقمه',
    'Service Area': 'منطقة الخدمة',
    'All Areas': 'جميع المناطق',
    'Clear Filters': 'مسح عوامل التصفية',
    'Showing': 'عرض',
    'of': 'من أصل',
    'routes': 'مسارات',

    // Status
    'Available': 'متاح',
    'Inactive': 'غير نشط',
    'Full': 'مكتمل',
    'Active': 'نشط',

    // Route names
    'North Amman Route': 'مسار شمال عمّان',
    'West Amman Route': 'مسار غرب عمّان',
    'Downtown Route': 'مسار وسط البلد',
    'East Amman Route': 'مسار شرق عمّان',
    'South Amman Route': 'مسار جنوب عمّان',
    'University Street Route': 'مسار شارع الجامعة',

    // Areas
    'North Amman': 'شمال عمّان',
    'West Amman': 'غرب عمّان',
    'Downtown': 'وسط البلد',
    'East Amman': 'شرق عمّان',
    'South Amman': 'جنوب عمّان',

    // Locations
    'Abu Nseir': 'أبو نصير',
    'Abu Nseir Circle': 'دوار أبو نصير',
    'Shafa Badran': 'شفا بدران',
    'University Street': 'شارع الجامعة',
    'Basi School': 'مدرسة باصي',
    'Khalda': 'خلدا',
    'Khalda Circle': 'دوار خلدا',
    'Tla Al-Ali': 'تلاع العلي',
    'Dabouq': 'دابوق',
    'Ras Al-Ain': 'رأس العين',
    'Downtown Amman': 'وسط عمّان',
    'Jabal Amman': 'جبل عمّان',
    'Marka': 'ماركا',
    'Prince Hamzah Hospital Area': 'منطقة مستشفى الأمير حمزة',
    'Tabarbour': 'طبربور',
    'Naour': 'ناعور',
    'Marj Al-Hamam': 'مرج الحمام',
    'Airport Road': 'طريق المطار',
    'Jubaiha': 'الجبيهة',
    'Jordan University Gate': 'بوابة الجامعة الأردنية',

    // Route card
    'Starting Point': 'نقطة الانطلاق',
    'Destination': 'الوجهة',
    'Morning Pickup': 'الاصطحاب الصباحي',
    'Afternoon Drop-off': 'التوصيل بعد الظهر',
    'Stops': 'المحطات',
    'Hide Details': 'إخفاء التفاصيل',
    'View Route Details': 'عرض تفاصيل المسار',

    // Expanded details
    'Complete Route Details': 'تفاصيل المسار الكاملة',
    'Route Number:': 'رقم المسار:',
    'Route Name:': 'اسم المسار:',
    'Service Area:': 'منطقة الخدمة:',
    'Starting Point:': 'نقطة الانطلاق:',
    'Destination:': 'الوجهة:',
    'Route Status:': 'حالة المسار:',

    // Schedule
    'Stops and Pickup / Drop-off Schedules':
      'المحطات وجداول الاصطحاب والتوصيل',
    'Stop': 'المحطة',
    'These are demonstration schedules and capacity figures. Actual information should be confirmed with the transportation office.':
      'هذه المواعيد وأرقام السعة تجريبية. يرجى التأكد من المعلومات الفعلية من مكتب النقل.',

    // Bus and driver
    'Assigned Bus and Driver': 'الحافلة والسائق المعيّنان',
    'Assigned Bus': 'الحافلة المعيّنة',
    'Assigned Driver': 'السائق المعيّن',
    'Not assigned yet': 'لم يتم التعيين بعد',

    // Capacity
    'Route Capacity': 'سعة المسار',
    'Total Capacity': 'السعة الإجمالية',
    'students': 'طلاب',
    'Registered Students': 'الطلاب المسجلون',
    'Remaining Seats': 'المقاعد المتبقية',

    // Subscription
    'Request Transportation': 'طلب خدمة النقل',
    'Route Currently Inactive': 'المسار غير نشط حالياً',
    'No Seats Available': 'لا توجد مقاعد متاحة',
    'Request Subscription': 'طلب اشتراك',

    // Empty state
    'No Routes Found': 'لم يتم العثور على مسارات',
    'Try a different route name or service area.':
      'جرّب اسم مسار أو منطقة خدمة مختلفة.',
    'Show All Routes': 'عرض جميع المسارات',

    // CTA
    'Need School Transportation?': 'هل تحتاج إلى النقل المدرسي؟',
    'Explore our transportation services and request a subscription.':
      'استكشف خدمات النقل لدينا وقدّم طلب اشتراك.',

    // Footer
    'Basi School Transportation': 'باصي للنقل المدرسي',
    'Safe and reliable school transportation.':
      'خدمات نقل مدرسي آمنة وموثوقة.',
    '© 2026 Basi School Transportation. All rights reserved.':
      '© 2026 باصي للنقل المدرسي. جميع الحقوق محفوظة.',
  };

  protected translate(value: string): string {
    return this.isArabic()
      ? (this.arabicText[value] ?? value)
      : value;
  }

  // Demonstration data.
  // Replace these values with actual database information when available.
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
      assignedBus: null,
      assignedDriver: null,
      capacity: 30,
      enrolledStudents: 24,
      isActive: true,
      stops: [
        {
          name: 'Abu Nseir Circle',
          pickupTime: '6:45 AM',
          dropoffTime: '2:45 PM',
        },
        {
          name: 'Shafa Badran',
          pickupTime: '6:55 AM',
          dropoffTime: '2:35 PM',
        },
        {
          name: 'University Street',
          pickupTime: '7:10 AM',
          dropoffTime: '2:20 PM',
        },
        {
          name: 'Basi School',
          pickupTime: '7:30 AM',
          dropoffTime: '2:00 PM',
        },
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
      assignedBus: null,
      assignedDriver: null,
      capacity: 30,
      enrolledStudents: 25,
      isActive: true,
      stops: [
        {
          name: 'Khalda Circle',
          pickupTime: '6:50 AM',
          dropoffTime: '2:40 PM',
        },
        {
          name: 'Tla Al-Ali',
          pickupTime: '7:00 AM',
          dropoffTime: '2:30 PM',
        },
        {
          name: 'Dabouq',
          pickupTime: '7:12 AM',
          dropoffTime: '2:18 PM',
        },
        {
          name: 'Basi School',
          pickupTime: '7:30 AM',
          dropoffTime: '2:00 PM',
        },
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
      assignedBus: null,
      assignedDriver: null,
      capacity: 30,
      enrolledStudents: 22,
      isActive: true,
      stops: [
        {
          name: 'Ras Al-Ain',
          pickupTime: '6:40 AM',
          dropoffTime: '2:50 PM',
        },
        {
          name: 'Downtown Amman',
          pickupTime: '6:50 AM',
          dropoffTime: '2:40 PM',
        },
        {
          name: 'Jabal Amman',
          pickupTime: '7:05 AM',
          dropoffTime: '2:25 PM',
        },
        {
          name: 'Basi School',
          pickupTime: '7:30 AM',
          dropoffTime: '2:00 PM',
        },
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
      assignedBus: null,
      assignedDriver: null,
      capacity: 30,
      enrolledStudents: 28,
      isActive: true,
      stops: [
        {
          name: 'Marka',
          pickupTime: '6:40 AM',
          dropoffTime: '2:45 PM',
        },
        {
          name: 'Prince Hamzah Hospital Area',
          pickupTime: '6:55 AM',
          dropoffTime: '2:30 PM',
        },
        {
          name: 'Tabarbour',
          pickupTime: '7:10 AM',
          dropoffTime: '2:15 PM',
        },
        {
          name: 'Basi School',
          pickupTime: '7:30 AM',
          dropoffTime: '2:00 PM',
        },
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
      assignedBus: null,
      assignedDriver: null,
      capacity: 30,
      enrolledStudents: 26,
      isActive: true,
      stops: [
        {
          name: 'Naour',
          pickupTime: '6:35 AM',
          dropoffTime: '2:50 PM',
        },
        {
          name: 'Marj Al-Hamam',
          pickupTime: '6:50 AM',
          dropoffTime: '2:35 PM',
        },
        {
          name: 'Airport Road',
          pickupTime: '7:05 AM',
          dropoffTime: '2:20 PM',
        },
        {
          name: 'Basi School',
          pickupTime: '7:30 AM',
          dropoffTime: '2:00 PM',
        },
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
      assignedBus: null,
      assignedDriver: null,
      capacity: 30,
      enrolledStudents: 30,
      isActive: true,
      stops: [
        {
          name: 'Jubaiha',
          pickupTime: '6:50 AM',
          dropoffTime: '2:40 PM',
        },
        {
          name: 'Jordan University Gate',
          pickupTime: '7:00 AM',
          dropoffTime: '2:30 PM',
        },
        {
          name: 'University Street',
          pickupTime: '7:12 AM',
          dropoffTime: '2:18 PM',
        },
        {
          name: 'Basi School',
          pickupTime: '7:30 AM',
          dropoffTime: '2:00 PM',
        },
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

      const matchesArea =
        area === 'All' || route.serviceArea === area;

      return matchesSearch && matchesArea;
    });
  });

  protected remainingSeats(route: SchoolRoute): number {
    return Math.max(0, route.capacity - route.enrolledStudents);
  }

  protected canRequestTransportation(route: SchoolRoute): boolean {
    return route.isActive && this.remainingSeats(route) > 0;
  }

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