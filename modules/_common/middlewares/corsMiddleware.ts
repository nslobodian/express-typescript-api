import * as express from 'express'

export async function corsMiddleware (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,DELETE,OPTIONS,POST,PUT')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if ('OPTIONS' === req.method) {
    return res.sendStatus(200)
  }

  return next()
}
