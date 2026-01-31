import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';

export interface VariableData {
  id: string;
  key: string;
  value: string;
  isOverride: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class VariableApi {
  private http = inject(HttpClient);
  private baseUrl = `${environment.serverBaseUrl}/variable`;

  createVariable(data: {
    environmentId: string;
    key: string;
    value: string;
    isOverride?: boolean;
  }) {
    return this.http.post<{ variableId: string }>(this.baseUrl, data);
  }

  updateVariable(id: string, data: { key?: string; value?: string }) {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  deleteVariable(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
