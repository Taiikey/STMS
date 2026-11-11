import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService, LoginResponse, RegisterResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created with initial unauthenticated state', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(service.token()).toBeNull();
  });

  it('should send POST request to /api/auth/register', () => {
    const mockResponse: RegisterResponse = { message: 'Registered successfully' };
    const payload = {
      fullName: 'Ahmad Guardian',
      email: 'ahmad@example.com',
      phone: '0791234567',
      address: 'Amman, Jubaiha',
      password: 'password123',
    };

    service.register(payload).subscribe((res) => {
      expect(res.message).toBe('Registered successfully');
    });

    const req = httpMock.expectOne('/api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      fullName: 'Ahmad Guardian',
      email: 'ahmad@example.com',
      phone: '0791234567',
      address: 'Amman, Jubaiha',
      password: 'password123',
    });

    req.flush(mockResponse, { status: 201, statusText: 'Created' });
  });

  it('should send POST request to /api/auth/login and persist session', () => {
    const mockLoginResponse: LoginResponse = {
      token: 'jwt.sample.token',
      role: 'Parent',
      fullName: 'Ahmad Guardian',
      email: 'ahmad@example.com',
    };

    service.login({ email: 'ahmad@example.com', password: 'password123' }).subscribe((res) => {
      expect(res.token).toBe('jwt.sample.token');
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'ahmad@example.com',
      password: 'password123',
    });

    req.flush(mockLoginResponse);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.userRole()).toBe('Parent');
    expect(service.userFullName()).toBe('Ahmad Guardian');
    expect(service.token()).toBe('jwt.sample.token');
  });

  it('should clear session upon logout', () => {
    service.setSession({
      token: 'active.token',
      role: 'Parent',
      fullName: 'Ahmad Guardian',
      email: 'ahmad@example.com',
    });

    expect(service.isAuthenticated()).toBe(true);

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(service.token()).toBeNull();
  });
});

