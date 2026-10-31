export type FieldError = { field: string; message: string };

export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: FieldError[],
  ) {
    super(message);
  }
}
