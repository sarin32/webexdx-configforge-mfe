import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import {
  BrnAlertDialogContent,
  BrnAlertDialogTrigger,
} from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { toast } from 'ngx-sonner';
import { lastValueFrom } from 'rxjs';
import { handleError } from '../../../../utils/error-utils';
import { EnvironmentApi } from '../../services/environment-api';

@Component({
  selector: 'app-delete-environment-modal',
  standalone: true,
  imports: [
    BrnAlertDialogTrigger,
    BrnAlertDialogContent,
    HlmAlertDialogImports,
    HlmButton,
  ],
  templateUrl: './delete-environment-modal.html',
})
export class DeleteEnvironmentModal {
  private environmentApi = inject(EnvironmentApi);

  envId = input.required<string>();
  environmentName = input.required<string>();
  triggerClass = input<string>('');
  variant = input<any>('default');
  size = input<any>('default');

  @Output() deleted = new EventEmitter<void>();

  loading = signal(false);

  async onDelete(ctx: any) {
    this.loading.set(true);
    try {
      await lastValueFrom(this.environmentApi.deleteEnvironment(this.envId()));
      toast.success('Environment deleted successfully');
      this.deleted.emit();
      ctx.close();
    } catch (err) {
      handleError(err);
    } finally {
      this.loading.set(false);
    }
  }
}
