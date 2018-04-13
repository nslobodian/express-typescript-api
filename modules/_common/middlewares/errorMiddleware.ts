import * as Raven from 'raven'
import * as express from 'express'

import { CebulaRequest } from '../interfaces'
import { HttpError } from '../errors/HttpError'

function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

function getErrorCode (err: any) {
  if (isNumeric(err.statusCode)) {
    return err.statusCode
  }

  if (isNumeric(err.status)) {
    return err.status
  }

  return 404
}

export async function errorMiddleware (err: any, req: CebulaRequest, res: express.Response, next: express.NextFunction) {
  const code = getErrorCode(err)

  console.log(err)

  if (!(err instanceof HttpError) && err.name !== 'UnauthorizedError') {
    Raven.captureException(err)
  }

  return res.status(code).json({
    status: err.status || 'Internal Error',
    name: err.name,
    statusCode: err.statusCode ,
    message: err.message,
  })
}
