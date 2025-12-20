import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { environment } from '../../../environments/environment';
import { ModeToggle } from '../mode-toggle/mode-toggle';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [ModeToggle, HlmButtonModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css',
})
export class Navbar {
    // Inject HttpClient
    private http = inject(HttpClient);

    logout() {
        this.http
            .post(
                `${environment.authServiceUrl}/logout`,
                {},
                { withCredentials: true },
            )
            .subscribe({
                next: () => {
                    window.location.href = `${environment.authAppUrl}/login`;
                },
                error: () => {
                    // Even if error, redirect to login
                    window.location.href = `${environment.authAppUrl}/login`;
                },
            });
    }
}
