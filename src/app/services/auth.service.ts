import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface RegisterPayload {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly password: string;
}

export interface RegisterResponse {
  readonly message: string;
}

export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly token: string;
  readonly role: string;
  readonly fullName: string;
  readonly email: string;
}

export interface UserSession {
  readonly token: string;
  readonly role: string;
  readonly fullName: string;
  readonly email: string;
}

const AUTH_STORAGE_KEY = 'stms_auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly sessionSignal = signal<UserSession | null>(this.loadStoredSession());
  public readonly currentUser = this.sessionSignal.asReadonly();

  public readonly isAuthenticated = computed(() => Boolean(this.sessionSignal()?.token));
  public readonly userRole = computed(() => this.sessionSignal()?.role ?? null);
  public readonly userFullName = computed(() => this.sessionSignal()?.fullName ?? null);
  public readonly userEmail = computed(() => this.sessionSignal()?.email ?? null);
  public readonly token = computed(() => this.sessionSignal()?.token ?? null);

  private loadStoredSession(): UserSession | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored) as UserSession;
        }
      }
    } catch {
      // Ignore storage read errors in test environments
    }
    return null;
  }

  public register(payload: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/api/auth/register', {
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      address: payload.address.trim(),
      password: payload.password,
    });
  }

  public login(credentials: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/auth/login', {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      })
      .pipe(
        tap((response) => {
          this.setSession({
            token: response.token,
            role: response.role,
            fullName: response.fullName,
            email: response.email,
          });
        })
      );
  }

  public logout(): void {
    this.sessionSignal.set(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Ignore storage write errors
    }
  }

  public setSession(session: UserSession): void {
    this.sessionSignal.set(session);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      }
    } catch {
      // Ignore storage write errors
    }
  }
}

