import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ParentRegistration } from './parent-registration';
import { RegistrationService } from '../services/registration.service';

describe('ParentRegistration', () => {
  let registrationService: RegistrationService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ParentRegistration],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        RegistrationService,
      ],
    }).compileComponents();

    registrationService = TestBed.inject(RegistrationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should invalidate empty form', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;

    expect(component['registerForm'].valid).toBe(false);
  });

  it('should validate email format strictly', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;
    const emailControl = component['registerForm'].get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBe(false);

    emailControl?.setValue('user@domain');
    expect(emailControl?.valid).toBe(false);

    emailControl?.setValue('parent@example.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should require password to have at least 8 characters', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;
    const passwordControl = component['registerForm'].get('password');

    passwordControl?.setValue('1234567');
    expect(passwordControl?.valid).toBe(false);

    passwordControl?.setValue('12345678');
    expect(passwordControl?.valid).toBe(true);
  });

  it('should validate password confirmation matching', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;
    const passwordControl = component['registerForm'].get('password');
    const confirmControl = component['registerForm'].get('confirmPassword');

    passwordControl?.setValue('password123');
    confirmControl?.setValue('differentPass');
    expect(component['registerForm'].hasError('passwordMismatch')).toBe(true);

    confirmControl?.setValue('password123');
    expect(component['registerForm'].hasError('passwordMismatch')).toBe(false);
  });

  it('should validate Jordanian mobile numbers correctly', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;
    const phoneControl = component['registerForm'].get('phone');

    // Valid formats: Zain (079), Umniah (078), Orange (077) with or without +962
    phoneControl?.setValue('0785457267');
    expect(phoneControl?.valid).toBe(true);

    phoneControl?.setValue('0791234567');
    expect(phoneControl?.valid).toBe(true);

    phoneControl?.setValue('0771234567');
    expect(phoneControl?.valid).toBe(true);

    phoneControl?.setValue('+962 78 545 7267');
    expect(phoneControl?.valid).toBe(true);

    // Invalid numbers (non-Jordanian or wrong prefixes)
    phoneControl?.setValue('0501234567');
    expect(phoneControl?.valid).toBe(false);

    phoneControl?.setValue('0761234567');
    expect(phoneControl?.valid).toBe(false);

    phoneControl?.setValue('12345');
    expect(phoneControl?.valid).toBe(false);
  });

  it('should show duplicate email error when API returns 409 Conflict', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;

    component['registerForm'].setValue({
      fullName: 'New Parent',
      email: 'parent@example.com',
      phone: '0791234567',
      address: 'Amman, Abdoun',
      password: 'password123',
      confirmPassword: 'password123',
      canManageChildrenTransport: true,
      initialChildName: '',
    });

    component['onSubmit']();

    const req = httpMock.expectOne('/api/auth/register');
    req.flush({ message: 'Email is already registered.' }, { status: 409, statusText: 'Conflict' });

    expect(component['errorMessage']()).toBe(component['t']().regDuplicateEmailError);
    expect(component['successMessage']()).toBeNull();
  });

  it('should show server connection error when server is unreachable', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;

    component['registerForm'].setValue({
      fullName: 'New Parent',
      email: 'parent@example.com',
      phone: '0791234567',
      address: 'Amman, Abdoun',
      password: 'password123',
      confirmPassword: 'password123',
      canManageChildrenTransport: true,
      initialChildName: '',
    });

    component['onSubmit']();

    const req = httpMock.expectOne('/api/auth/register');
    req.error(new ProgressEvent('error'), { status: 0 });

    expect(component['errorMessage']()).toBe(component['t']().serverConnectionError);
    expect(component['successMessage']()).toBeNull();
  });

  it('should succeed on valid registration when API responds with 201 Created', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;

    component['registerForm'].setValue({
      fullName: 'Test Parent',
      email: 'test@example.com',
      phone: '0785457267',
      address: 'Wasfi Al Tal Street, Amman',
      password: 'secretPassword123',
      confirmPassword: 'secretPassword123',
      canManageChildrenTransport: true,
      initialChildName: 'Test Student',
    });

    component['onSubmit']();

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      fullName: 'Test Parent',
      email: 'test@example.com',
      phone: '0785457267',
      address: 'Wasfi Al Tal Street, Amman',
      password: 'secretPassword123',
    });

    req.flush({ message: 'Registered successfully' }, { status: 201, statusText: 'Created' });

    expect(component['errorMessage']()).toBeNull();
    expect(component['successMessage']()).toBeTruthy();
    expect(registrationService.isEmailRegistered('test@example.com')).toBe(true);
  });
});
