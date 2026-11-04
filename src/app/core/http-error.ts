import { HttpErrorResponse } from '@angular/common/http';

export function httpErrorMessage(
  e: HttpErrorResponse,
  action: string,
  notFound = 'Not found',
): string {
  switch (e.status) {
    case 0:
      return 'Server is down';
    case 401:
      return 'Session expired, please log in again';
    case 403:
      return 'Access denied';
    case 404:
      return notFound;
    default:
      return `Failed to ${action}`;
  }
}
