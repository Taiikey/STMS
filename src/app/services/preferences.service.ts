import { Injectable, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface AppTranslations {
  // Navigation
  readonly navServices: string;
  readonly navRoutesSafety: string;
  readonly navOfficeContact: string;
  readonly navLogin: string;
  readonly navRegister: string;

  // Home Hero
  readonly heroTag: string;
  readonly heroTitle: string;
  readonly heroDesc: string;
  readonly heroViewServices: string;
  readonly heroRegisterNow: string;
  readonly heroLogin: string;

  // Home Services
  readonly servicesBadge: string;
  readonly servicesTitle: string;
  readonly servicesSubtitle: string;
  readonly servicesActionBtn: string;
  readonly serviceList: readonly {
    readonly title: string;
    readonly description: string;
    readonly iconSrc: string;
    readonly iconAlt: string;
    readonly width: number;
    readonly height: number;
  }[];

  // Home Guidelines
  readonly infoBadge: string;
  readonly infoTitle: string;
  readonly infoSubtitle: string;
  readonly infoCards: readonly {
    readonly title: string;
    readonly category: string;
    readonly points: readonly string[];
  }[];

  // Home CTA
  readonly ctaTitle: string;
  readonly ctaDesc: string;
  readonly ctaRegisterBtn: string;
  readonly ctaLoginBtn: string;

  // Home Office
  readonly officeBadge: string;
  readonly officeTitle: string;
  readonly officeSubtitle: string;
  readonly officeLocationLabel: string;
  readonly officeLocationVal: string;
  readonly officeHoursLabel: string;
  readonly officeHoursVal: string;
  readonly officePhoneLabel: string;
  readonly officeEmailLabel: string;
  readonly officeEmergencyLabel: string;
  readonly officeName: string;
  readonly officeDesc: string;
  readonly footerCopyright: string;

  // Parent Registration
  readonly regTitle: string;
  readonly regSubtitle: string;
  readonly fullNameLabel: string;
  readonly fullNamePlaceholder: string;
  readonly fullNameError: string;
  readonly emailLabel: string;
  readonly emailPlaceholder: string;
  readonly emailError: string;
  readonly phoneLabel: string;
  readonly phonePlaceholder: string;
  readonly phoneError: string;
  readonly addressLabel: string;
  readonly addressPlaceholder: string;
  readonly addressError: string;
  readonly passwordLabel: string;
  readonly passwordPlaceholder: string;
  readonly passwordError: string;
  readonly confirmPasswordLabel: string;
  readonly confirmPasswordPlaceholder: string;
  readonly confirmPasswordRequiredError: string;
  readonly passwordMismatchError: string;
  readonly canManageTransportLabel: string;
  readonly childNameLabel: string;
  readonly childNamePlaceholder: string;
  readonly submitBtn: string;
  readonly submittingBtn: string;
  readonly loginPrompt: string;
  readonly loginLinkText: string;
  readonly regSuccess: string;
  readonly regGenericError: string;
  readonly regDuplicateEmailError: string;

  // Login
  readonly loginTitle: string;
  readonly loginSubtitle: string;
  readonly loginEmailLabel: string;
  readonly loginEmailPlaceholder: string;
  readonly loginEmailError: string;
  readonly loginPasswordLabel: string;
  readonly loginPasswordPlaceholder: string;
  readonly loginPasswordError: string;
  readonly loginSubmitBtn: string;
  readonly loginSubmittingBtn: string;
  readonly loginNoAccountPrompt: string;
  readonly loginRegisterLink: string;
  readonly loginSuccess: string;
  readonly loginGenericError: string;
}

const EN_TRANSLATIONS: AppTranslations = {
  navServices: 'Services',
  navRoutesSafety: 'Routes & Safety',
  navOfficeContact: 'Office & Contact',
  navLogin: 'Log In',
  navRegister: 'Register',

  heroTag: 'School Transport Services',
  heroTitle: 'Safe, Punctual & Reliable School Transportation',
  heroDesc:
    'Welcome to Basi School Transportation. We ensure students arrive safely and comfortably each day with certified drivers, supervised vehicles, and structured neighborhood routes.',
  heroViewServices: 'View Services',
  heroRegisterNow: 'Register Now',
  heroLogin: 'Log In',

  servicesBadge: 'Our Services',
  servicesTitle: 'Transportation Services Offered',
  servicesSubtitle:
    'Providing tailored and secure transit solutions for all students throughout the school year.',
  servicesActionBtn: 'Register for Transport Services',
  serviceList: [
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
  ],

  infoBadge: 'Guidelines',
  infoTitle: 'Routes, Arrangements & Safety Procedures',
  infoSubtitle:
    'Clear guidelines to maintain safe travel, predictable schedules, and orderly arrangements.',
  infoCards: [
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
  ],

  ctaTitle: 'Register for School Transportation',
  ctaDesc:
    'Enroll your student for the upcoming term or log in to manage your transport route and student schedule.',
  ctaRegisterBtn: 'Register Student',
  ctaLoginBtn: 'Parent Log In',

  officeBadge: 'Support & Location',
  officeTitle: 'Transportation Office Details',
  officeSubtitle:
    'Have questions regarding bus routes or transport registrations? Contact our office team.',
  officeLocationLabel: 'Office Location',
  officeLocationVal: 'Main Administration Building, Ground Floor, Suite 104',
  officeHoursLabel: 'Working Hours',
  officeHoursVal: 'Sunday to Thursday from 7:00 AM to 3:30 PM',
  officePhoneLabel: 'Direct Office Phone',
  officeEmailLabel: 'Office Email',
  officeEmergencyLabel: 'Emergency Helpline',
  officeName: 'Basi School Transportation Office',
  officeDesc: 'Committed to safe, secure, and disciplined school transport operations.',
  footerCopyright: '© 2026 Basi Transportation Services. All rights reserved.',

  regTitle: 'Parent or Guardian Registration',
  regSubtitle: 'Create an account to manage transportation arrangements for your children.',
  fullNameLabel: 'Full Name *',
  fullNamePlaceholder: 'Enter your full name',
  fullNameError: 'Full name is required (minimum 3 characters).',
  emailLabel: 'Email Address *',
  emailPlaceholder: 'email@example.com',
  emailError: 'Please enter a valid email address.',
  phoneLabel: 'Phone Number *',
  phonePlaceholder: 'e.g. 078 545 7267 or +962 78 545 7267',
  phoneError: 'Please enter a valid Jordanian mobile number (077, 078, or 079).',
  addressLabel: 'Residential Address *',
  addressPlaceholder: 'District, Street name, Residence number',
  addressError: 'Residential address is required for route planning.',
  passwordLabel: 'Password *',
  passwordPlaceholder: 'Minimum 8 characters',
  passwordError: 'Password must be at least 8 characters.',
  confirmPasswordLabel: 'Confirm Password *',
  confirmPasswordPlaceholder: 'Reenter your password',
  confirmPasswordRequiredError: 'Please confirm your password.',
  passwordMismatchError: 'Passwords do not match.',
  canManageTransportLabel:
    'Allow this account to manage transportation information for my children',
  childNameLabel: 'Child or Student Name (Optional)',
  childNamePlaceholder: 'Enter child name to assign transportation',
  submitBtn: 'Complete Registration',
  submittingBtn: 'Creating Account...',
  loginPrompt: 'Already registered?',
  loginLinkText: 'Log In here',
  regSuccess: 'Account registered successfully. Redirecting to login page...',
  regGenericError: 'Please complete all required fields with valid details.',
  regDuplicateEmailError: 'An account with this email address is already registered.',

  loginTitle: 'Welcome Back',
  loginSubtitle: 'Unified portal for parents, guardians, and administration staff.',
  loginEmailLabel: 'Email Address *',
  loginEmailPlaceholder: 'email@example.com',
  loginEmailError: 'Please enter a valid email address.',
  loginPasswordLabel: 'Password *',
  loginPasswordPlaceholder: 'Enter your password',
  loginPasswordError: 'Password is required with at least 8 characters.',
  loginSubmitBtn: 'Sign In',
  loginSubmittingBtn: 'Signing In...',
  loginNoAccountPrompt: 'Do not have an account?',
  loginRegisterLink: 'Register here',
  loginSuccess: 'Login successful! Redirecting to portal...',
  loginGenericError: 'Please provide valid credentials.',
};

const AR_TRANSLATIONS: AppTranslations = {
  navServices: 'الخدمات',
  navRoutesSafety: 'المسارات والسلامة',
  navOfficeContact: 'المكتب والتواصل',
  navLogin: 'تسجيل الدخول',
  navRegister: 'التسجيل',

  heroTag: 'خدمات النقل المدرسي',
  heroTitle: 'مرحباً بكم في باصي للنقل المدرسي',
  heroDesc:
    'نضمن وصول الطلاب بأمان وراحة يومياً عبر سائقين معتمدين ومشرفين متخصصين ومسارات منتظمة.',
  heroViewServices: 'عرض الخدمات',
  heroRegisterNow: 'سجل الآن',
  heroLogin: 'تسجيل الدخول',

  servicesBadge: 'خدماتنا',
  servicesTitle: 'خدمات النقل المقدمة',
  servicesSubtitle:
    'حلول تنقل مخصصة ومريحة وآمنة لجميع الطلاب طوال العام الدراسي.',
  servicesActionBtn: 'التسجيل في خدمات النقل',
  serviceList: [
    {
      title: 'النقل اليومي للطلاب',
      description:
        'نقل صباحي دقيق وعودة مسائية تغطي الأحياء السكنية المحددة بمقاعد مخصصة.',
      iconSrc: 'shool_bus.png',
      iconAlt: 'أيقونة حافلة مدرسية',
      width: 88,
      height: 56,
    },
    {
      title: 'حافلات الأنشطة بعد المدرسة',
      description:
        'نقل مخصص للطلاب المشاركين في الأنشطة الرياضية والنوادي والبرامج الإثرائية.',
      iconSrc: 'watch.png',
      iconAlt: 'أيقونة موعد وساعة',
      width: 58,
      height: 72,
    },
    {
      title: 'تتبع الحافلات والتنبيهات المباشرة',
      description:
        'متابعة حية لحركة الحافلات وإشعارات وصول آلية لأولياء الأمور وإدارة المدرسة.',
      iconSrc: 'pin.png',
      iconAlt: 'أيقونة تتبع وتنبيه',
      width: 60,
      height: 72,
    },
  ],

  infoBadge: 'إرشادات',
  infoTitle: 'المسارات والترتيبات وإجراءات السلامة',
  infoSubtitle:
    'إرشادات واضحة لضمان تنقل آمن وجداول منضبطة وترتيبات منظمة.',
  infoCards: [
    {
      title: 'المسارات والمواعيد',
      category: 'المسارات',
      points: [
        'نقاط تجمع محددة لتقليل وقت تنقل الطالب.',
        'وصول الطلاب صباحاً بحلول 7:30 صباحاً وبدء رحلات العودة 3:15 مساءً.',
        'تحديثات مباشرة للمسارات أثناء الازدحام المروري.',
      ],
    },
    {
      title: 'ترتيبات النقل',
      category: 'الترتيبات',
      points: [
        'تخصيص مقاعد محددة لضمان مقعد مخصص لكل طالب.',
        'مشرف حافلة معتمد على كل حافلة لمساعدة الطلاب.',
        'إمكانية تقديم طلبات الإجازة أو تغيير المسار المؤقت عبر البوابة.',
      ],
    },
    {
      title: 'إجراءات السلامة',
      category: 'السلامة',
      points: [
        'إلزامية أحزمة الأمان ومراقبة الصعود والنزول.',
        'سائقون معتمدون يخضعون لتقييم دوري في القيادة الآمنة.',
        'فحص دوري للمركبات وخط طوارئ لاسلكي مباشر.',
      ],
    },
  ],

  ctaTitle: 'التسجيل في النقل المدرسي',
  ctaDesc:
    'سجل طالبك للفصل الدراسي القادم أو سجل دخولك لإدارة مسار النقل وجدول الطالب.',
  ctaRegisterBtn: 'تسجيل طالب',
  ctaLoginBtn: 'دخول ولي الأمر',

  officeBadge: 'الدعم والموقع',
  officeTitle: 'تفاصيل مكتب النقل',
  officeSubtitle:
    'هل لديك استفسارات حول مسارات الحافلات أو التسجيل؟ تواصل مع فريق المكتب.',
  officeLocationLabel: 'موقع المكتب',
  officeLocationVal: 'مبنى الإدارة الرئيسي، الطابق الأرضي، جناح 104',
  officeHoursLabel: 'ساعات العمل',
  officeHoursVal: 'الأحد إلى الخميس من 7:00 صباحاً إلى 3:30 مساءً',
  officePhoneLabel: 'هاتف المكتب المباشر',
  officeEmailLabel: 'البريد الإلكتروني',
  officeEmergencyLabel: 'خط الطوارئ المباشر',
  officeName: 'مكتب باصي للنقل المدرسي',
  officeDesc: 'ملتزمون بتشغيل نقل مدرسي آمن وموثوق ومنضبط.',
  footerCopyright: '© 2026 باصي للنقل المدرسي. جميع الحقوق محفوظة.',

  regTitle: 'تسجيل ولي الأمر',
  regSubtitle: 'أنشئ حساباً لإدارة ترتيبات النقل المدرسي لأبنائك.',
  fullNameLabel: 'الاسم الكامل *',
  fullNamePlaceholder: 'أدخل اسمك الكامل',
  fullNameError: 'الاسم الكامل مطلوب (3 أحرف كحد أدنى).',
  emailLabel: 'البريد الإلكتروني *',
  emailPlaceholder: 'email@example.com',
  emailError: 'يرجى إدخال بريد إلكتروني صحيح.',
  phoneLabel: 'رقم الهاتف *',
  phonePlaceholder: 'مثال: 0785457267 أو 57267 7854 962+',
  phoneError: 'يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ 077 أو 078 أو 079.',
  addressLabel: 'عنوان السكن *',
  addressPlaceholder: 'الحي، اسم الشارع، رقم المبنى',
  addressError: 'عنوان السكن مطلوب لتحديد المسار المناسب.',
  passwordLabel: 'كلمة المرور *',
  passwordPlaceholder: '8 خانات على الأقل',
  passwordError: 'يجب ألا تقل كلمة المرور عن 8 خانات.',
  confirmPasswordLabel: 'تأكيد كلمة المرور *',
  confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
  confirmPasswordRequiredError: 'يرجى تأكيد كلمة المرور.',
  passwordMismatchError: 'كلمتا المرور غير متطابقتين.',
  canManageTransportLabel:
    'السماح لهذا الحساب بإدارة معلومات النقل لأبنائي',
  childNameLabel: 'اسم الطالب أو الابن (اختياري)',
  childNamePlaceholder: 'أدخل اسم الطالب لربط النقل المدرسي',
  submitBtn: 'إتمام التسجيل',
  submittingBtn: 'جاري إنشاء الحساب...',
  loginPrompt: 'مسجل مسبقاً؟',
  loginLinkText: 'تسجيل الدخول هنا',
  regSuccess: 'تم تسجيل الحساب بنجاح. جاري التحويل إلى صفحة الدخول...',
  regGenericError: 'يرجى تعبئة جميع الحقول المطلوبة ببيانات صحيحة.',
  regDuplicateEmailError: 'يوجد حساب مسجل مسبقاً بهذا البريد الإلكتروني.',

  loginTitle: 'تسجيل الدخول',
  loginSubtitle: 'بوابة موحدة لأولياء الأمور وإدارة المدرسة.',
  loginEmailLabel: 'البريد الإلكتروني *',
  loginEmailPlaceholder: 'email@example.com',
  loginEmailError: 'يرجى إدخال بريد إلكتروني صحيح.',
  loginPasswordLabel: 'كلمة المرور *',
  loginPasswordPlaceholder: 'أدخل كلمة المرور',
  loginPasswordError: 'كلمة المرور مطلوبة (8 خانات كحد أدنى).',
  loginSubmitBtn: 'تسجيل الدخول',
  loginSubmittingBtn: 'جاري الدخول...',
  loginNoAccountPrompt: 'ليس لديك حساب؟',
  loginRegisterLink: 'سجل هنا',
  loginSuccess: 'تم تسجيل الدخول بنجاح. جاري التحويل...',
  loginGenericError: 'يرجى إدخال بيانات دخول صحيحة.',
};

const STORAGE_LANG = 'stms_lang';
const STORAGE_THEME = 'stms_theme';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  private readonly document = inject(DOCUMENT);

  public readonly lang = signal<Language>(this.getInitialLang());
  public readonly theme = signal<Theme>(this.getInitialTheme());

  public readonly isDark = computed(() => this.theme() === 'dark');
  public readonly isRtl = computed(() => this.lang() === 'ar');
  public readonly t = computed(() =>
    this.lang() === 'ar' ? AR_TRANSLATIONS : EN_TRANSLATIONS
  );

  constructor() {
    this.applyTheme(this.theme());
    this.applyLang(this.lang());
  }

  public toggleTheme(): void {
    const nextTheme: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(nextTheme);
    this.applyTheme(nextTheme);
    try {
      localStorage.setItem(STORAGE_THEME, nextTheme);
    } catch {
      // Ignore storage write issues
    }
  }

  public toggleLanguage(): void {
    const nextLang: Language = this.lang() === 'ar' ? 'en' : 'ar';
    this.setLanguage(nextLang);
  }

  public setLanguage(lang: Language): void {
    this.lang.set(lang);
    this.applyLang(lang);
    try {
      localStorage.setItem(STORAGE_LANG, lang);
    } catch {
      // Ignore storage write issues
    }
  }

  private applyTheme(theme: Theme): void {
    if (this.document?.documentElement) {
      this.document.documentElement.setAttribute('data-theme', theme);
    }
  }

  private applyLang(lang: Language): void {
    if (this.document?.documentElement) {
      this.document.documentElement.setAttribute('lang', lang);
      this.document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }
  }

  private getInitialLang(): Language {
    try {
      const saved = localStorage.getItem(STORAGE_LANG) as Language | null;
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    } catch {
      // Ignore storage read issues
    }
    return 'en';
  }

  private getInitialTheme(): Theme {
    try {
      const saved = localStorage.getItem(STORAGE_THEME) as Theme | null;
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      if (
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        return 'dark';
      }
    } catch {
      // Ignore storage read issues
    }
    return 'light';
  }
}

