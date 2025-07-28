export class ApiError extends Error {
  statusCode: number;
  errors?: {
    field: any;
    message: any;
  }[];

  constructor(
    statusCode: number,
    message: string,
    errors?: {
      field: any;
      message: any;
    }[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors || [];
    Error.captureStackTrace(this, this.constructor);
  }
}
