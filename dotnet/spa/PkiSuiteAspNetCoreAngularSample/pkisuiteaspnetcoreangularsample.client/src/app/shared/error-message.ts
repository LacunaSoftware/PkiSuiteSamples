import { HttpErrorResponse } from '@angular/common/http';

/**
 * Returns a message to show for an error thrown by an API call or by Web PKI. The server answers
 * errors with application/problem+json, whose "detail" (or "title") is the message.
 */
export function errorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error;
    if (body && typeof body === 'object') {
      if (typeof body.detail === 'string' && body.detail) {
        return body.detail;
      }
      if (typeof body.title === 'string' && body.title) {
        return body.title;
      }
    }
    if (typeof body === 'string' && body) {
      return body;
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Returns the validation results that the server attaches to some errors, such as a rejected
 * certificate or signature, in the problem's "validationResults" field. Returns null when there are
 * none. Pages show them below the error message.
 */
export function errorValidationResults(error: unknown): string | null {
  if (error instanceof HttpErrorResponse && typeof error.error?.validationResults === 'string') {
    return error.error.validationResults;
  }
  return null;
}
