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
import { TokenApi } from '../../services/token-api';

@Component({
  selector: 'app-revoke-token-modal',
  standalone: true,
  imports: [
    BrnAlertDialogTrigger,
    BrnAlertDialogContent,
    HlmAlertDialogImports,
    HlmButton,
  ],
  templateUrl: './revoke-token-modal.html',
})
export class RevokeTokenModal {
  private tokenApi = inject(TokenApi);

  tokenId = input.required<string>();
  tokenName = input.required<string>();
  triggerClass = input<string>('');
  variant = input<any>('default');
  size = input<any>('default');

  @Output() revoked = new EventEmitter<void>();

  loading = signal(false);

  async onRevoke(ctx: any) {
    this.loading.set(true);
    try {
      await lastValueFrom(this.tokenApi.deleteToken(this.tokenId()));
      toast.success('Token revoked successfully');
      this.revoked.emit();
      ctx.close();
    } catch (err) {
      handleError(err);
    } finally {
      this.loading.set(false);
    }
  }
}
