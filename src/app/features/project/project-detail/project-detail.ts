import {
  Component,
  computed,
  Input,
  inject,
  type OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronLeft,
  lucideCopy,
  lucideEdit,
  lucideKey,
  lucidePlus,
  lucideTrash2,
  lucideX,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { toast } from 'ngx-sonner';
import { lastValueFrom } from 'rxjs';
import { handleError } from '../../../utils/error-utils';
import { AddKeyModal } from '../components/add-key-modal/add-key-modal';
import { CreateEnvironmentModal } from '../components/create-environment-modal/create-environment-modal';
import { DeleteEnvironmentModal } from '../components/delete-environment-modal/delete-environment-modal';
import { DeleteProjectModal } from '../components/delete-project-modal/delete-project-modal';
import { RemoveVariableModal } from '../components/remove-variable-modal/remove-variable-modal';
import { EnvironmentApi } from '../services/environment-api';
import {
  type DetailedVariableData,
  type GetProjectDataInDetailResult,
  ProjectService,
} from '../services/project-api';
import type { TokenData } from '../services/token-api';
import { VariableApi } from '../services/variable-api';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    HlmButton,
    HlmInput,
    FormsModule,
    HlmIcon,
    NgIcon,
    RouterLink,
    CreateEnvironmentModal,
    AddKeyModal,
    DeleteProjectModal,
    DeleteEnvironmentModal,
    RemoveVariableModal,
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

  // Computed signals for matrix view
  hasEnvironments = computed(
    () => (this.selectedProject()?.environments.length ?? 0) > 0,
  );
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
        const found = env.variables.find((v) => v.key === key);
        if (found) {
          m[key][env.id] = found;
        }
      }
    }
    return m;
  });

  // Cell editing state
  editingCell = signal<{ key: string; envId: string } | null>(null);
  editingValue = '';

  // Project Name Editing
  isEditingTitle = signal(false);
  editingTitle = signal('');

  ngOnInit() {
    this.fetchDetail();
  }

  async fetchDetail(silent = false) {
    if (!silent) this.loading.set(true);
    try {
      const response = await lastValueFrom(
        this.projectService.getProjectDetail(this.id),
      );
      this.selectedProject.set(response);

      // Clean up extraKeys that are now present in the response
      const responseKeys = new Set<string>();
      for (const env of response.environments) {
        for (const v of env.variables) {
          responseKeys.add(v.key);
        }
      }
      this.extraKeys.update((keys) => keys.filter((k) => !responseKeys.has(k)));
    } catch (err) {
      handleError(err);
    } finally {
      if (!silent) this.loading.set(false);
    }
  }

  backToList() {
    this.router.navigate(['/project']);
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
      await lastValueFrom(
        this.projectService.updateProject(this.id, {
          name: this.editingTitle(),
        }),
      );
      toast.success('Project renamed successfully');
      this.isEditingTitle.set(false);
      await this.fetchDetail(true);
    } catch (err) {
      handleError(err);
    }
  }

  async onKeyAdded(key: string) {
    if (key && !this.allKeys().includes(key)) {
      this.extraKeys.update((keys) => [...keys, key]);
      toast.success(`Parameter "${key}" initialized`);
    }
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
        await lastValueFrom(
          this.variableApi.updateVariable(currentVar.id, {
            value: this.editingValue,
          }),
        );
      } else {
        // Create new
        await lastValueFrom(
          this.variableApi.createVariable({
            environmentId: cell.envId,
            key: cell.key,
            value: this.editingValue,
          }),
        );
      }
      toast.success('Variable updated successfully');
      this.editingCell.set(null);
      await this.fetchDetail(true);
    } catch (err) {
      handleError(err);
    }
  }
}
