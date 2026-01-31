import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';

export function handleError(err: any, fallbackMessage = 'Something went wrong') {
    let message = fallbackMessage;

    if (err instanceof HttpErrorResponse) {
        // Backend often returns { message: "msg" }
        if (err.status === 0) {
            message = 'Could not reach the server. Please try again.';
        } else if (err.error && typeof err.error.message === 'string') {
            message = err.error.message;
        } else if (typeof err.error === 'string') {
            message = err.error;
        } else if (err.message) {
            message = err.message;
        }
    } else if (err instanceof Error) {
        message = err.message;
    } else if (typeof err === 'string') {
        message = err;
    }

    toast.error(message);
    console.error('Handled Error:', err);
}
