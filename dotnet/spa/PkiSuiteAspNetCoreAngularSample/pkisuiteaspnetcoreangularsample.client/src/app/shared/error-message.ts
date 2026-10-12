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
