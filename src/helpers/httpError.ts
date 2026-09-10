/**
 * Error for a non-ok HTTP response, carrying the status so callers can react to it (e.g. 404).
 */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

interface HttpErrorDetails {
  status: number;
  statusText: string;
  url: string;
  body: string;
}

export function createHttpError({ status, statusText, url, body }: HttpErrorDetails): HttpError {
  return new HttpError(status, `HTTP ${status} ${statusText} for ${url}: ${body}`);
}
