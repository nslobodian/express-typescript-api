import * as express from 'express'

import { positionRouter } from './position/position.controller'

const router = express.Router()

/**
 * @swagger
 * /status
 *   get:
 *     description: check health status
 *     tags:
 *       - Check
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: number
 *             message:
 *               type: string
 */

router.get('/status', (req: express.Request, res: express.Response) => {
  return res.status(200).json({
    status: 'green',
    message: ':)',
  })
})

router.use('/positions', positionRouter)

export { router }
