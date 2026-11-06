
import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Header } from '../header/header';
import { PreferencesService } from '../services/preferences.service';

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
  imports: [NgOptimizedImage, RouterLink, Header],
  templateUrl: './transport.html',
  styleUrl: './transport.css',
})
export class Transport {
  protected readonly prefs = inject(PreferencesService);

  protected readonly isArabic = computed(
    () => this.prefs.lang() === 'ar'
  );

  protected readonly isMenuOpen = signal(false);



  private readonly arabicText: Record<string, string> = {
    'Transportation Services': 'خدمات النقل',

    'Choose the Transportation Plan That Fits Your Child':
      'اختر خطة النقل المناسبة لطفلك',

    'Compare the services offered by the school, see the fees and service areas, then view the routes and stops or send a subscription request.':
      'قارن بين الخدمات التي تقدمها المدرسة، واطّلع على الرسوم ومناطق الخدمة، ثم شاهد المسارات والمحطات أو أرسل طلب اشتراك.',

    'View Routes & Stops': 'عرض المسارات والمحطات',
    'Request Subscription': 'طلب اشتراك',

    'Available Services': 'الخدمات المتاحة',
    'Our Transportation Options': 'خيارات النقل لدينا',

    'Every option includes supervised buses and certified drivers.':
      'يتضمن كل خيار حافلات تحت الإشراف وسائقين معتمدين.',

    'Round-Trip Transportation': 'النقل ذهاباً وإياباً',

    'Morning pickup from your stop and afternoon return home, with a reserved seat for the whole subscription period.':
      'اصطحاب صباحي من محطتك وعودة إلى المنزل بعد الظهر، مع مقعد مخصص طوال فترة الاشتراك.',

    'One-Way Transportation': 'النقل باتجاه واحد',

    'Choose either the morning pickup or the afternoon drop-off if your child only needs one direction.':
      'اختر الاصطحاب صباحاً أو التوصيل بعد الظهر إذا كان طفلك يحتاج إلى اتجاه واحد فقط.',

    'After School Activity Shuttle': 'حافلة أنشطة ما بعد المدرسة',

    'Later afternoon departures for students joining clubs, sports training, and extracurricular programs.':
      'رحلات بعد الظهر للطلاب المشاركين في النوادي والتدريبات الرياضية والأنشطة اللامنهجية.',

    'JOD per month': 'دينار أردني شهرياً',

    'North Amman': 'شمال عمّان',
    'West Amman': 'غرب عمّان',
    'Downtown': 'وسط البلد',
    'East Amman': 'شرق عمّان',

    'Service Areas': 'مناطق الخدمة',
    'Subscription Conditions': 'شروط الاشتراك',

    'Subscription is valid for one school term.':
      'الاشتراك صالح لفصل دراسي واحد.',

    'Student must be registered under a parent or guardian account.':
      'يجب تسجيل الطالب ضمن حساب ولي الأمر أو الوصي.',

    'Subject to seat availability on the chosen route.':
      'يخضع لتوفر المقاعد في المسار المختار.',

    'Direction (pickup or drop-off) is selected at subscription time.':
      'يتم تحديد الاتجاه (الاصطحاب أو التوصيل) عند الاشتراك.',

    'Changing direction requires a modification request.':
      'يتطلب تغيير الاتجاه تقديم طلب تعديل.',

    'Available only on days with scheduled activities.':
      'متاح فقط في الأيام التي توجد فيها أنشطة مجدولة.',

    'Requires an active main transportation subscription.':
      'يتطلب وجود اشتراك نقل أساسي فعال.',

    'Pickup stop is the same as the main route.':
      'محطة الاصطحاب هي نفسها محطة المسار الأساسي.',

    'View Routes': 'عرض المسارات',

    'Good to Know': 'معلومات مهمة',

    'These rules apply to every transportation service.':
      'تُطبق هذه القواعد على جميع خدمات النقل.',

    'Registration Required': 'التسجيل مطلوب',

    'Parents or guardians must register an account and add each student before subscribing.':
      'يجب على أولياء الأمور أو الأوصياء إنشاء حساب وإضافة كل طالب قبل الاشتراك.',

    'Approval by Administration': 'موافقة الإدارة',

    'Every subscription request is reviewed and approved or rejected by the transportation office.':
      'يراجع مكتب النقل كل طلب اشتراك ويوافق عليه أو يرفضه.',

    'Payments': 'المدفوعات',

    'Payment status is recorded by the school administration. No online payment is processed on this site.':
      'تسجل إدارة المدرسة حالة الدفع. لا تتم معالجة أي دفعات إلكترونية عبر هذا الموقع.',

    'Cancellation and Changes': 'الإلغاء والتعديلات',

    'Cancellation or modification requests can be submitted from the My Transportation page according to school rules.':
      'يمكن تقديم طلبات الإلغاء أو التعديل من صفحة نقلي وفقاً لأنظمة المدرسة.',

    'Ready to Subscribe?': 'هل أنت مستعد للاشتراك؟',

    'Log in to pick your student, route, and pickup stop, or register a parent account first.':
      'سجل الدخول لاختيار الطالب والمسار ومحطة الاصطحاب، أو أنشئ حساب ولي أمر أولاً.',

    'Register': 'التسجيل',
    'Parent Log In': 'دخول ولي الأمر',

    'Basi School Transportation Office': 'مكتب باصي للنقل المدرسي',

    'Committed to safe, secure, and disciplined school transport operations.':
      'ملتزمون بتقديم خدمات نقل مدرسي آمنة وموثوقة ومنظمة.',

    '© 2026 Basi Transportation Services. All rights reserved.':
      '© 2026 باصي لخدمات النقل. جميع الحقوق محفوظة.',

    'School bus icon': 'أيقونة حافلة مدرسية',
    'Schedule watch icon': 'أيقونة ساعة وجدول',
    'Location pin icon': 'أيقونة تحديد الموقع',
  };

  
/* translation function!!*/
  protected translate(value: string): string {
    return this.isArabic()
      ? (this.arabicText[value] ?? value)
      : value;
  }

 


  protected readonly services = signal<readonly TransportService[]>([
    {
      title: 'Round-Trip Transportation',
      description:
        'Morning pickup from your stop and afternoon return home, with a reserved seat for the whole subscription period.',
      fee: 40,
      feeUnit: 'JOD per month',
      serviceAreas: [
        'North Amman',
        'West Amman',
        'Downtown',
      ],
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
      serviceAreas: [
        'North Amman',
        'West Amman',
        'East Amman',
      ],
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
      serviceAreas: [
        'West Amman',
        'Downtown',
      ],
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
