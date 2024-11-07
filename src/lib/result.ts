export type Result<T, E extends AppError = AppError> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export class AppError extends Error {
  public readonly code: string;
  public readonly cause?: unknown;

  constructor(message: string, code: string, cause?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.cause = cause;
  }

  static is<T extends AppError>(
    this: new (...args: any[]) => T,
    error: unknown,
  ): error is T {
    return error instanceof this;
  }
}

export class InputValidationError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, "INPUT_VALIDATION_ERROR", cause);
  }
}
