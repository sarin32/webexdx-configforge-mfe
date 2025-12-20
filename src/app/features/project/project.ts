import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, type OnInit } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { lastValueFrom } from 'rxjs';
import { ProjectService } from './services/project-api';

interface ProjectData {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [HlmButton, DatePipe],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project implements OnInit {
  private projectService = inject(ProjectService);
  projects: ProjectData[] = [];
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchProjects();
  }

  async fetchProjects() {
    this.loading = true;
    this.error = null;

    try {
      const response = await lastValueFrom(
        this.projectService.getProjectList(),
      );
      this.projects = response;
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof HttpErrorResponse) {
        message = error.error.message || message;
      }
      this.error = message;
    }
    this.loading = false;
  }

  createNewProject() {
    // Logic to create a new project
  }
  updateProject(projectId: string) {
    // Logic to update an existing project
  }
  getProjectDetails(projectId: string) {
    // Logic to view project details
  }
}
