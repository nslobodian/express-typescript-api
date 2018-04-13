import { HttpError } from './HttpError'

export class UnauthorizedHttpError extends HttpError {
  constructor (name: string, status = 'Unauthorized', statusCode = 401) {
    super(name, status, statusCode)
  }
}
