import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

describe('Login', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();
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

  it('should show error when submitting invalid form', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component['onSubmit']();

    expect(component['errorMessage']()).toBeTruthy();
    expect(component['successMessage']()).toBeNull();
  });

  it('should succeed on valid login input', () => {
    const fixture = TestBed.createComponent(Login);
    const component = fixture.componentInstance;

    component['loginForm'].setValue({
      email: 'admin@school.edu.sa',
      password: 'password123',
    });

    component['onSubmit']();

    expect(component['errorMessage']()).toBeNull();
    expect(component['successMessage']()).toBeTruthy();
  });
});

