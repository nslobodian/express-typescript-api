import { HttpError } from './HttpError'

export class NotFoundHttpError extends HttpError {
  constructor (name: string, status = 'Not Found', statusCode = 404) {
    super(name, status, statusCode)
  }
}
