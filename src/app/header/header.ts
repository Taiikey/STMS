import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { PreferencesService } from '../services/preferences.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public readonly variant = input<'full' | 'minimal'>('full');

  protected readonly prefs = inject(PreferencesService);
  protected readonly t = this.prefs.t;
  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}

