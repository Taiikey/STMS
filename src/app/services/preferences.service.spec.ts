import { TestBed } from '@angular/core/testing';
import { PreferencesService } from './preferences.service';

describe('PreferencesService', () => {
  let service: PreferencesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [PreferencesService],
    });
    service = TestBed.inject(PreferencesService);
  });

  it('should initialize with default english and light mode', () => {
    expect(service.lang()).toBe('en');
    expect(service.theme()).toBe('light');
    expect(service.isDark()).toBe(false);
    expect(service.isRtl()).toBe(false);
  });

  it('should toggle language to arabic and update rtl', () => {
    service.toggleLanguage();
    expect(service.lang()).toBe('ar');
    expect(service.isRtl()).toBe(true);
    expect(service.t().navServices).toBe('الخدمات');

    service.toggleLanguage();
    expect(service.lang()).toBe('en');
    expect(service.isRtl()).toBe(false);
  });

  it('should toggle theme to dark and light', () => {
    service.toggleTheme();
    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBe(true);

    service.toggleTheme();
    expect(service.theme()).toBe('light');
    expect(service.isDark()).toBe(false);
  });
});

