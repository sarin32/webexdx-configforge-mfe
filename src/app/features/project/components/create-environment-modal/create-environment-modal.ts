import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lucidePlus } from '@ng-icons/lucide';
import { NgIcon } from '@ng-icons/core';
import { lastValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { EnvironmentApi } from '../../services/environment-api';
import { handleError } from '../../../../utils/error-utils';

@Component({
    selector: 'app-create-environment-modal',
    standalone: true,
    imports: [
        FormsModule,
        NgIcon,
        BrnAlertDialogTrigger,
        BrnAlertDialogContent,
        HlmAlertDialogImports,
        HlmButton,
        HlmInput,
    ],
    templateUrl: './create-environment-modal.html',
})
export class CreateEnvironmentModal {
    private environmentApi = inject(EnvironmentApi);

    projectId = input.required<string>();
    @Output() created = new EventEmitter<void>();

    envName = '';
    loading = signal(false);

    resetForm() {
        this.envName = '';
    }

    async create(ctx: any) {
        if (!this.envName || this.loading()) return;

        this.loading.set(true);
        try {
            await lastValueFrom(this.environmentApi.createEnvironment({
                name: this.envName,
                projectId: this.projectId()
            }));
            toast.success('Environment created successfully');
            this.created.emit();
            ctx.close();
        } catch (err) {
            handleError(err);
        } finally {
            this.loading.set(false);
        }
    }
}
