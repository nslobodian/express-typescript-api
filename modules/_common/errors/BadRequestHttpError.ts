import { HttpError } from './HttpError'

export class BadRequestHttpError extends HttpError {
  constructor (name: string, status = 'Bad Request', statusCode = 400) {
    super(name, status, statusCode)
    Error.captureStackTrace(this, this.constructor)
  }
}
