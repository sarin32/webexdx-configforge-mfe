import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private apiUrl = `${environment.serverBaseUrl}/project`;

  constructor(private http: HttpClient) { }

  createProject(projectData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, projectData);
  }

  updateProject(projectData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/edit`, projectData);
  }

  getProjectList(): Observable<any> {
    return this.http.post(`${this.apiUrl}/getList`, {});
  }

  getProjectDetails(projectId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/getDataInDetail`, { projectId });
  }
}
