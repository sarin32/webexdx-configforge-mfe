import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { NgIcon } from '@ng-icons/core';
import { TokenApi } from '../../services/token-api';
import { handleError } from '../../../../utils/error-utils';

@Component({
    selector: 'app-generate-token-modal',
    standalone: true,
    imports: [
        FormsModule,
        BrnAlertDialogTrigger,
        BrnAlertDialogContent,
        HlmAlertDialogImports,
        HlmButton,
        HlmInput,
        BrnSelectImports,
        HlmSelectImports,
        NgIcon,
    ],
    templateUrl: './generate-token-modal.html',
})
export class GenerateTokenModal {
    private tokenApi = inject(TokenApi);

    projectId = input.required<string>();
    environments = input.required<any[]>();
    triggerClass = input<string>('');
    variant = input<any>('default');
    size = input<any>('default');

    @Output() generated = new EventEmitter<void>();

    loading = signal(false);
    generatedToken = signal<string | null>(null);

    selectedEnvId = '';
    tokenName = '';
    tokenExpiry = 30;

    onGenerate() {
        if (!this.tokenName) return;
        this.loading.set(true);

        this.tokenApi.createToken({
            environmentId: this.selectedEnvId,
            name: this.tokenName,
            expiresInDays: this.tokenExpiry
        }).subscribe({
            next: (res: { token: string }) => {
                this.generatedToken.set(res.token);
                toast.success('Token generated successfully');
                this.generated.emit();
                this.loading.set(false);
            },
            error: (err: any) => {
                handleError(err);
                this.loading.set(false);
            }
        });
    }

    copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
        toast.success('Token copied to clipboard');
    }

    reset() {
        this.generatedToken.set(null);
        this.tokenName = '';
        this.selectedEnvId = this.environments()[0]?.id || '';
        this.tokenExpiry = 30;
    }
}
