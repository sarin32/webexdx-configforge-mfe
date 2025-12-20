import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export interface ProjectData {
  projectId: string; // Backend uses projectId
  name: string;
  createdAt: Date;
  environmentCount: number;
}

export interface DetailedVariableData {
  id: string;
  key: string;
  value: string;
  isOverride: boolean;
}

export interface EnvironmentData {
  id: string;
  environmentName: string;
  variables: DetailedVariableData[];
}

export interface GetProjectDataInDetailResult {
  id: string;
  name: string;
  createdAt: Date;
  environments: EnvironmentData[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.serverBaseUrl}/project`;

  createProject(projectData: { name: string }) {
    return this.http.post<{ projectId: string }>(`${this.baseUrl}`, projectData);
  }

  getProjectList() {
    return this.http.get<ProjectData[]>(this.baseUrl);
  }

  getProjectDetail(projectId: string) {
    return this.http.get<GetProjectDataInDetailResult>(`${this.baseUrl}/${projectId}`);
  }

  updateProject(projectId: string, data: { name: string }) {
    return this.http.put<void>(`${this.baseUrl}/${projectId}`, data);
  }

  deleteProject(projectId: string) {
    return this.http.delete<void>(`${this.baseUrl}/${projectId}`);
  }
}
