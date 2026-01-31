import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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

  deleteEnvironment(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
