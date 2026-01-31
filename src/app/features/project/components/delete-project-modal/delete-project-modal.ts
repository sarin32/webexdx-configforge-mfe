import { Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { ProjectService } from '../../services/project-api';
import { handleError } from '../../../../utils/error-utils';

@Component({
    selector: 'app-delete-project-modal',
    standalone: true,
    imports: [
        BrnAlertDialogTrigger,
        BrnAlertDialogContent,
        HlmAlertDialogImports,
        HlmButton,
    ],
    templateUrl: './delete-project-modal.html',
})
export class DeleteProjectModal {
    private projectService = inject(ProjectService);

    projectId = input.required<string>();
    projectName = input.required<string>();
    triggerClass = input<string>('');
    variant = input<any>('default');
    size = input<any>('default');

    @Output() deleted = new EventEmitter<void>();

    loading = signal(false);

    async onDelete(ctx: any) {
        this.loading.set(true);
        try {
            await lastValueFrom(this.projectService.deleteProject(this.projectId()));
            toast.success('Project deleted successfully');
            this.deleted.emit();
            ctx.close();
        } catch (err) {
            handleError(err);
        } finally {
            this.loading.set(false);
        }
    }
}
