import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, inject, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideCopy,
  lucideKey,
  lucidePlus,
  lucideTrash2,
} from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { toast } from 'ngx-sonner';
import { lastValueFrom } from 'rxjs';
import { handleError } from '../../../utils/error-utils';
import { GenerateTokenModal } from '../components/generate-token-modal/generate-token-modal';
import { RevokeTokenModal } from '../components/revoke-token-modal/revoke-token-modal';
import {
  type GetProjectDataInDetailResult,
  ProjectService,
} from '../services/project-api';
import { TokenApi, type TokenData } from '../services/token-api';

@Component({
  selector: 'app-project-tokens',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmButton,
    HlmIcon,
    NgIcon,
    DatePipe,
    HlmSelectImports,
    BrnSelectImports,
    GenerateTokenModal,
    RevokeTokenModal,
  ],
  templateUrl: './project-tokens.html',
})
export class ProjectTokens implements OnInit {
  private projectService = inject(ProjectService);
  private tokenApi = inject(TokenApi);
  private router = inject(Router);

  @Input() id!: string;

  project = signal<GetProjectDataInDetailResult | null>(null);
  allTokens = signal<TokenData[]>([]);
  loading = signal(false);

  async ngOnInit() {
    await this.fetchProject();
    await this.fetchAllTokens();
  }

  async fetchProject() {
    this.loading.set(true);
    try {
      const data = await lastValueFrom(
        this.projectService.getProjectDetail(this.id),
      );
      this.project.set(data);
    } catch (err) {
      handleError(err);
    } finally {
      this.loading.set(false);
    }
  }

  async fetchAllTokens() {
    const environments = this.project()?.environments || [];
    if (!environments.length) return;

    try {
      // Fetch tokens for all environments in parallel
      const tokenRequests = environments.map((env) =>
        lastValueFrom(this.tokenApi.getEnvironmentTokens(env.id)),
      );
      const results = await Promise.all(tokenRequests);
      this.allTokens.set(results.flat());
    } catch (err) {
      handleError(err);
    }
  }

  getEnvironmentName(envId: string): string {
    return (
      this.project()?.environments.find((e) => e.id === envId)
        ?.environmentName || 'Unknown'
    );
  }

  backToProject() {
    this.router.navigate(['/project', this.id]);
  }
}
