import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { BrnMenuTrigger } from '@spartan-ng/brain/menu';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmMenu, HlmMenuItem } from '@spartan-ng/helm/menu';
import { type Theme, ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-mode-toggle',
  standalone: true,
  imports: [BrnMenuTrigger, HlmMenu, HlmMenuItem, HlmButtonModule, NgIcon],
  providers: [provideIcons({ lucideMoon, lucideSun })],
  templateUrl: './mode-toggle.html',
})
export class ModeToggle {
  private readonly _themeService = inject(ThemeService);
  theme = this._themeService.theme;

  setTheme(theme: Theme) {
    this._themeService.setTheme(theme);
  }
}
