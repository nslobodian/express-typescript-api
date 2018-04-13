import 'reflect-metadata'
import { Server } from './app'
import { createConnection } from 'typeorm'
import * as dotenv from 'dotenv'
const debug = require('debug')('server')
import { config } from './config/config'

try {
  dotenv.config({ path: __dirname + '/../.env' })
  const application = Server.bootstrap()

  createConnection().then(() => {
    debug(`✓ PostgresSQL DB Connection`)
  })

  application.app.listen(config.port, () => {
    debug(`✓ HTTP Server (${config.port})`)
  })
} catch (err) {
  console.log(err)
}
