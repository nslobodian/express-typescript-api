import { HttpError } from './HttpError'

export class ForbiddenHttpError extends HttpError {
  constructor (name: string, status = 'Forbidden', statusCode = 403) {
    super(name, status, statusCode)
  }
}
