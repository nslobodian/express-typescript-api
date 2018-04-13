import express = require('express')

export async function notFoundMiddleware (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.status(404)
  res.send({
    message: 'API not found',
  })

  next()
}
