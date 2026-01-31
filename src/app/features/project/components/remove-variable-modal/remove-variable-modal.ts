import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { VariableApi } from '../../services/variable-api';
import { handleError } from '../../../../utils/error-utils';

@Component({
    selector: 'app-remove-variable-modal',
    standalone: true,
    imports: [
        BrnAlertDialogTrigger,
        BrnAlertDialogContent,
        HlmAlertDialogImports,
        HlmButton,
    ],
    templateUrl: './remove-variable-modal.html',
})
export class RemoveVariableModal {
    private variableApi = inject(VariableApi);

    variableId = input.required<string>();
    keyName = input.required<string>();
    environmentName = input.required<string>();
    triggerClass = input<string>('');
    variant = input<any>('default');
    size = input<any>('default');

    @Output() removed = new EventEmitter<void>();

    loading = signal(false);

    async onRemove(ctx: any) {
        this.loading.set(true);
        try {
            await lastValueFrom(this.variableApi.deleteVariable(this.variableId()));
            toast.success('Variable override removed');
            this.removed.emit();
            ctx.close();
        } catch (err) {
            handleError(err);
        } finally {
            this.loading.set(false);
        }
    }
}
