import { effect, Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const theme = this._theme();
      localStorage.setItem('ui-theme', theme);
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
        root.classList.add(systemTheme);
        return;
      }

      root.classList.add(theme);
    });
  }

  get theme() {
    return this._theme.asReadonly();
  }

  setTheme(theme: Theme) {
    this._theme.set(theme);
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem('ui-theme') as Theme;
    if (savedTheme) return savedTheme;
    return 'system';
  }
}
