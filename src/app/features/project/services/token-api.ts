import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export interface TokenData {
    _id: string;
    name: string;
    token: string;
    environmentId: string;
    isActive: boolean;
    expiresOn: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root',
})
export class TokenApi {
    private http = inject(HttpClient);
    private baseUrl = `${environment.serverBaseUrl}/tokens`;

    createToken(data: { name: string; environmentId: string; expiresInDays?: number }) {
        return this.http.post<{ token: string }>(this.baseUrl, data);
    }

    getEnvironmentTokens(environmentId: string) {
        return this.http.post<TokenData[]>(`${this.baseUrl}/environment-tokens`, { environmentId });
    }

    deleteToken(id: string) {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

    deactivateToken(id: string) {
        return this.http.put(`${this.baseUrl}/${id}/deactivate`, {});
    }
}
