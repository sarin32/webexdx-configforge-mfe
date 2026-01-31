import { HttpErrorResponse } from '@angular/common/http';
import { computed, Component, inject, Input, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { lucideCheck, lucideChevronLeft, lucideEdit, lucidePlus, lucideTrash2, lucideX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { lastValueFrom } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { ProjectService, type GetProjectDataInDetailResult, type DetailedVariableData } from '../services/project-api';
import { VariableApi } from '../services/variable-api';
import { EnvironmentApi } from '../services/environment-api';

@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [
        HlmButton,
        HlmInput,
        FormsModule,
        HlmIcon,
        NgIcon,
    ],
    templateUrl: './project-detail.html',
})
export class ProjectDetail implements OnInit {
    private projectService = inject(ProjectService);
    private variableApi = inject(VariableApi);
    private environmentApi = inject(EnvironmentApi);
    private router = inject(Router);

    @Input() id!: string;

    selectedProject = signal<GetProjectDataInDetailResult | null>(null);
    loading = signal(false);
    error = signal<string | null>(null);

    // Computed signals for matrix view
    hasEnvironments = computed(() => (this.selectedProject()?.environments.length ?? 0) > 0);
    extraKeys = signal<string[]>([]);

    allKeys = computed(() => {
        const project = this.selectedProject();
        const extra = this.extraKeys();
        const keys = new Set<string>(extra);

        if (project) {
            for (const env of project.environments) {
                for (const v of env.variables) {
                    keys.add(v.key);
                }
            }
        }
        return Array.from(keys).sort();
    });

    // matrix[key][envId] = variable
    matrix = computed(() => {
        const project = this.selectedProject();
        const keys = this.allKeys();
        if (!project) return {};

        const m: Record<string, Record<string, DetailedVariableData>> = {};
        for (const key of keys) {
            m[key] = {};
            for (const env of project.environments) {
                const found = env.variables.find(v => v.key === key);
                if (found) {
                    m[key][env.id] = found;
                }
            }
        }
        return m;
    });

    // For adding new environment
    showCreateEnvironment = signal(false);
    newEnvironmentName = '';

    // For adding new variable row (key)
    showAddKey = signal(false);
    newKeyName = '';

    // Cell editing state
    editingCell = signal<{ key: string, envId: string } | null>(null);
    editingValue = '';

    // Project Name Editing
    isEditingTitle = signal(false);
    editingTitle = signal('');

    ngOnInit() {
        this.fetchDetail();
    }

    async fetchDetail(silent = false) {
        if (!silent) this.loading.set(true);
        this.error.set(null);
        try {
            const response = await lastValueFrom(this.projectService.getProjectDetail(this.id));
            this.selectedProject.set(response);

            // Clean up extraKeys that are now present in the response
            const responseKeys = new Set<string>();
            for (const env of response.environments) {
                for (const v of env.variables) {
                    responseKeys.add(v.key);
                }
            }
            this.extraKeys.update(keys => keys.filter(k => !responseKeys.has(k)));
        } catch (err) {
            this.handleError(err);
        } finally {
            if (!silent) this.loading.set(false);
        }
    }

    backToList() {
        this.router.navigate(['/project']);
    }

    async createEnvironment() {
        if (!this.newEnvironmentName) return;

        try {
            this.error.set(null);
            await lastValueFrom(this.environmentApi.createEnvironment({
                name: this.newEnvironmentName,
                projectId: this.id
            }));
            this.newEnvironmentName = '';
            this.showCreateEnvironment.set(false);
            await this.fetchDetail(true);
        } catch (err) {
            this.handleError(err);
        }
    }

    async deleteEnvironment(envId: string) {
        if (!window.confirm('Are you sure you want to delete this environment? All variables in this environment will be lost.')) return;

        try {
            await lastValueFrom(this.environmentApi.deleteEnvironment(envId));
            await this.fetchDetail(true);
        } catch (err) {
            this.handleError(err);
        }
    }

    // Project Actions
    startEditTitle() {
        const project = this.selectedProject();
        if (!project) return;
        this.editingTitle.set(project.name);
        this.isEditingTitle.set(true);
    }

    cancelEditTitle() {
        this.isEditingTitle.set(false);
    }

    async saveTitleEdit() {
        if (!this.editingTitle()) return;
        try {
            await lastValueFrom(this.projectService.updateProject(this.id, { name: this.editingTitle() }));
            this.isEditingTitle.set(false);
            await this.fetchDetail(true);
        } catch (err) {
            this.handleError(err);
        }
    }

    async deleteProject() {
        if (!window.confirm('Are you sure you want to delete this project? All environments and variables will be lost.')) return;
        try {
            await lastValueFrom(this.projectService.deleteProject(this.id));
            this.backToList();
        } catch (err) {
            this.handleError(err);
        }
    }

    // Row (Key) management
    toggleAddKey() {
        if (!this.hasEnvironments()) return;
        this.showAddKey.set(!this.showAddKey());
        this.newKeyName = '';
    }

    async addKeyRow() {
        if (!this.newKeyName) return;
        const trimmed = this.newKeyName.trim();
        if (trimmed && !this.allKeys().includes(trimmed)) {
            this.extraKeys.update(keys => [...keys, trimmed]);
        }
        this.newKeyName = '';
        this.showAddKey.set(false);
    }

    // Cell management
    startEditCell(key: string, envId: string, currentVar?: DetailedVariableData) {
        this.editingCell.set({ key, envId });
        this.editingValue = currentVar?.value || '';
    }

    cancelEditCell() {
        this.editingCell.set(null);
    }

    async saveCell() {
        const cell = this.editingCell();
        if (!cell) return;

        const currentVar = this.matrix()[cell.key]?.[cell.envId];

        try {
            if (currentVar) {
                // Update existing
                await lastValueFrom(this.variableApi.updateVariable(currentVar.id, { value: this.editingValue }));
            } else {
                // Create new
                await lastValueFrom(this.variableApi.createVariable({
                    environmentId: cell.envId,
                    key: cell.key,
                    value: this.editingValue
                }));
            }
            this.editingCell.set(null);
            await this.fetchDetail(true);
        } catch (err) {
            this.handleError(err);
        }
    }

    async deleteVariable(variableId: string) {
        if (!window.confirm('Are you sure you want to delete this variable override?')) return;

        try {
            await lastValueFrom(this.variableApi.deleteVariable(variableId));
            await this.fetchDetail(true);
        } catch (err) {
            this.handleError(err);
        }
    }

    private handleError(err: any) {
        let message = 'Something went wrong';
        if (err instanceof HttpErrorResponse) {
            message = err.error.message || message;
        }
        this.error.set(message);
    }
}
