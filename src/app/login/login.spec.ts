import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create the Login component', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should invalidate an empty form', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    expect(component['loginForm'].valid).toBe(false);
  });

  it('should validate email format strictly', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    const emailControl = component['loginForm'].get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBe(false);

    emailControl?.setValue('user@example.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should require a password of at least 8 characters', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;
    const passwordControl = component['loginForm'].get('password');

    passwordControl?.setValue('1234567');
    expect(passwordControl?.valid).toBe(false);

    passwordControl?.setValue('12345678');
    expect(passwordControl?.valid).toBe(true);
  });

  it('should show error when submitting invalid form without making HTTP calls', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component['onSubmit']();

    expect(component['errorMessage']()).toBeTruthy();
    expect(component['successMessage']()).toBeNull();
    httpMock.expectNone('/api/auth/login');
  });

  it('should succeed on valid login input and API response', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component['loginForm'].setValue({
      email: 'admin@school.edu.sa',
      password: 'password123',
    });

    component['onSubmit']();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({
      token: 'mock.jwt.token',
      role: 'Parent',
      fullName: 'School Parent',
      email: 'admin@school.edu.sa',
    });

    expect(component['errorMessage']()).toBeNull();
    expect(component['successMessage']()).toBeTruthy();
  });

  it('should display invalid credentials error when API returns 401', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component['loginForm'].setValue({
      email: 'wrong@school.edu.sa',
      password: 'password123',
    });

    component['onSubmit']();

    const req = httpMock.expectOne('/api/auth/login');
    req.flush({ message: 'Invalid email or password.' }, { status: 401, statusText: 'Unauthorized' });

    expect(component['errorMessage']()).toBe(component['t']().loginInvalidCredentialsError);
    expect(component['successMessage']()).toBeNull();
  });

  it('should display server connection error when backend is unreachable', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component['loginForm'].setValue({
      email: 'user@school.edu.sa',
      password: 'password123',
    });

    component['onSubmit']();

    const req = httpMock.expectOne('/api/auth/login');
    req.error(new ProgressEvent('error'), { status: 0 });

    expect(component['errorMessage']()).toBe(component['t']().serverConnectionError);
    expect(component['successMessage']()).toBeNull();
  });
});
