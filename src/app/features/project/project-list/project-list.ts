import { DatePipe } from '@angular/common';
import { Component, inject, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { lucideEdit, lucidePlus, lucideTrash2, lucideX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { lastValueFrom } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { toast } from 'ngx-sonner';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { handleError } from '../../../utils/error-utils';
import { ProjectService, type ProjectData } from '../services/project-api';

@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [
        HlmButton,
        DatePipe,
        HlmCardImports,
        HlmCardImports,
        HlmInput,
        HlmInput,
        FormsModule,
        HlmIcon,
        NgIcon,
        BrnAlertDialogTrigger,
        BrnAlertDialogContent,
        HlmAlertDialogImports,
    ],
    templateUrl: './project-list.html',
})
export class ProjectList implements OnInit {
    private projectService = inject(ProjectService);
    private router = inject(Router);

    projects = signal<ProjectData[]>([]);
    loading = signal(false);

    showCreateProject = signal(false);
    newProjectName = '';

    editingProjectId = signal<string | null>(null);
    editingName = signal('');

    ngOnInit() {
        this.fetchProjects();
    }

    async fetchProjects() {
        this.loading.set(true);
        try {
            const response = await lastValueFrom(this.projectService.getProjectList());
            this.projects.set(response);
        } catch (err) {
            handleError(err);
        } finally {
            this.loading.set(false);
        }
    }

    async createProject() {
        if (!this.newProjectName) return;
        try {
            await lastValueFrom(this.projectService.createProject({ name: this.newProjectName }));
            toast.success('Project created successfully');
            this.newProjectName = '';
            this.showCreateProject.set(false);
            await this.fetchProjects();
        } catch (err) {
            handleError(err);
        }
    }

    viewProjectDetail(projectId: string) {
        this.router.navigate(['/project', projectId]);
    }

    startEdit(project: ProjectData) {
        this.editingProjectId.set(project.projectId);
        this.editingName.set(project.name);
    }

    cancelEdit() {
        this.editingProjectId.set(null);
    }

    async saveUpdate(projectId: string) {
        if (!this.editingName()) return;
        try {
            await lastValueFrom(this.projectService.updateProject(projectId, { name: this.editingName() }));
            toast.success('Project updated successfully');
            this.editingProjectId.set(null);
            await this.fetchProjects();
        } catch (err) {
            handleError(err);
        }
    }

    async deleteProject(projectId: string) {
        try {
            await lastValueFrom(this.projectService.deleteProject(projectId));
            toast.success('Project deleted successfully');
            await this.fetchProjects();
        } catch (err) {
            handleError(err);
        }
    }
}
