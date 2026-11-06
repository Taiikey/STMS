import { Injectable, signal } from '@angular/core';

export interface ChildTransportInfo {
  readonly studentName: string;
  readonly grade?: string;
  readonly routeName?: string;
}

export interface ParentAccount {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly password: string;
  readonly canManageChildrenTransport: boolean;
  readonly children: readonly ChildTransportInfo[];
  readonly registeredAt: string;
}

export interface RegisterParentPayload {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly password: string;
  readonly canManageChildrenTransport?: boolean;
  readonly initialChildName?: string;
}

const STORAGE_KEY = 'stms_registered_parents';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private readonly parentsSignal = signal<readonly ParentAccount[]>(this.loadInitialParents());
  public readonly parents = this.parentsSignal.asReadonly();

  private loadInitialParents(): readonly ParentAccount[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored) as ParentAccount[];
        }
      }
    } catch {
      // Ignore storage errors in test or SSR environments
    }
    return [];
  }

  public isEmailRegistered(email: string): boolean {
    const normalized = email.trim().toLowerCase();
    return this.parentsSignal().some(
      (parent) => parent.email.trim().toLowerCase() === normalized
    );
  }

  public registerParent(payload: RegisterParentPayload): { success: boolean; error?: string } {
    if (this.isEmailRegistered(payload.email)) {
      return {
        success: false,
        error: 'An account with this email address is already registered.',
      };
    }

    const newAccount: ParentAccount = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim(),
      address: payload.address.trim(),
      password: payload.password,
      canManageChildrenTransport: payload.canManageChildrenTransport ?? true,
      children: payload.initialChildName?.trim()
        ? [{ studentName: payload.initialChildName.trim() }]
        : [],
      registeredAt: new Date().toISOString(),
    };

    const updated = [...this.parentsSignal(), newAccount];
    this.parentsSignal.set(updated);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // Ignore storage write errors
    }

    return { success: true };
  }
}

