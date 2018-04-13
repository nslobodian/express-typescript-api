export class HttpError extends Error {
  isCustom: boolean
  status: string
  statusCode: number

  constructor (name: string, status = 'Internal Error', statusCode = 500) {
    super(name)
    this.name = name
    this.isCustom = true
    this.status = status
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}
