import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EnvironmentApi {
    private http = inject(HttpClient);
    private baseUrl = `${environment.serverBaseUrl}/environment`;

    createEnvironment(data: { name: string; projectId: string }) {
        return this.http.post<{ environmentId: string }>(this.baseUrl, data);
    }
}
