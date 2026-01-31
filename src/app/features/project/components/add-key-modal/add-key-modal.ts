import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { lucidePlus } from '@ng-icons/lucide';
import { NgIcon } from '@ng-icons/core';
import { BrnAlertDialogContent, BrnAlertDialogTrigger } from '@spartan-ng/brain/alert-dialog';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInput } from '@spartan-ng/helm/input';

@Component({
    selector: 'app-add-key-modal',
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
    templateUrl: './add-key-modal.html',
})
export class AddKeyModal {
    existingKeys = input<string[]>([]);
    @Output() added = new EventEmitter<string>();

    keyName = '';
    error = '';

    resetForm() {
        this.keyName = '';
        this.error = '';
    }

    add(ctx: any) {
        const trimmed = this.keyName.trim();
        if (!trimmed) return;

        if (this.existingKeys().includes(trimmed)) {
            this.error = 'This parameter key already exists.';
            return;
        }

        this.added.emit(trimmed);
        ctx.close();
        this.resetForm();
    }
}
