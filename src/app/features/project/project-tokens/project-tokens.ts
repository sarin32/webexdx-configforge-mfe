import { Component, inject, Input, signal, type OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { lucideChevronLeft, lucideCopy, lucidePlus, lucideTrash2, lucideKey } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { lastValueFrom } from 'rxjs';
import { NgIcon } from '@ng-icons/core';
import { toast } from 'ngx-sonner';
import { ProjectService, type GetProjectDataInDetailResult } from '../services/project-api';
import { TokenApi, type TokenData } from '../services/token-api';
import { handleError } from '../../../utils/error-utils';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { GenerateTokenModal } from '../components/generate-token-modal/generate-token-modal';
import { RevokeTokenModal } from '../components/revoke-token-modal/revoke-token-modal';

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
            const data = await lastValueFrom(this.projectService.getProjectDetail(this.id));
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
            const tokenRequests = environments.map(env =>
                lastValueFrom(this.tokenApi.getEnvironmentTokens(env.id))
            );
            const results = await Promise.all(tokenRequests);
            this.allTokens.set(results.flat());
        } catch (err) {
            handleError(err);
        }
    }

    getEnvironmentName(envId: string): string {
        return this.project()?.environments.find(e => e.id === envId)?.environmentName || 'Unknown';
    }




    backToProject() {
        this.router.navigate(['/project', this.id]);
    }
}
