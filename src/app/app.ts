import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { Navbar } from './components/navbar/navbar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, HlmToasterImports],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
