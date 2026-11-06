import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ParentRegistration } from './parent-registration';
import { RegistrationService } from '../services/registration.service';

describe('ParentRegistration', () => {
  let registrationService: RegistrationService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ParentRegistration],
      providers: [provideRouter([]), RegistrationService],
    }).compileComponents();

    registrationService = TestBed.inject(RegistrationService);
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

  it('should validate email format', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;
    const emailControl = component['registerForm'].get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBe(false);

    emailControl?.setValue('parent@example.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should prevent duplicate email registration', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;

    registrationService.registerParent({
      fullName: 'Existing Parent',
      email: 'parent@example.com',
      phone: '+966 50 111 2222',
      address: 'Riyadh District 5',
      password: 'password123',
    });

    component['registerForm'].setValue({
      fullName: 'New Parent',
      email: 'parent@example.com',
      phone: '+966 50 333 4444',
      address: 'Riyadh District 2',
      password: 'password123',
      canManageChildrenTransport: true,
      initialChildName: '',
    });

    component['onSubmit']();

    expect(component['errorMessage']()).toContain('already registered');
    expect(component['successMessage']()).toBeNull();
  });

  it('should succeed on valid registration and store account', () => {
    const fixture = TestBed.createComponent(ParentRegistration);
    const component = fixture.componentInstance;

    component['registerForm'].setValue({
      fullName: 'Ahmad Al Mansoor',
      email: 'ahmad@example.com',
      phone: '+966 50 999 8888',
      address: 'Al Olaya Street, Riyadh',
      password: 'secretPassword123',
      canManageChildrenTransport: true,
      initialChildName: 'Sara Ahmad',
    });

    component['onSubmit']();

    expect(component['errorMessage']()).toBeNull();
    expect(component['successMessage']()).toContain('Account registered successfully');
    expect(registrationService.isEmailRegistered('ahmad@example.com')).toBe(true);
  });
});

