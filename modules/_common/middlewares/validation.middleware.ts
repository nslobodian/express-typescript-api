import { Response, NextFunction } from 'express'
import { validate } from 'class-validator'
import { CebulaRequest } from '../interfaces'

export const validationMiddleware = (DtoClass: any) => async (req: CebulaRequest, res: Response, next: NextFunction) => {
  const errors = await validate(new DtoClass(req.body))
  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  return next()
}
