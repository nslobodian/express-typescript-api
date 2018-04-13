import 'reflect-metadata'
import Raven = require('raven')
import express = require('express')
import swaggerJSDoc = require('swagger-jsdoc')
import swaggerUi = require('swagger-ui-express')

import { errorMiddleware } from './_common/middlewares/errorMiddleware'
import { corsMiddleware } from './_common/middlewares/corsMiddleware'
import { router } from './router'
import { config } from './config/config'
import { notFoundMiddleware } from './_common/middlewares/notFoundMiddleware'

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'Api',
      version: '1.0.0',
      description: 'Full documentation of API'
    },
    basePath: '/api/v1',
    produces: ['application/json'],
    consumes: ['application/json'],
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [
      { jwt: [] },
    ],
  },
  apis: ['./modules/**/*.controller.ts', './modules/docs/parameters.yaml'],
})

export class Server {
  public app: express.Application

  constructor () {
    this.app = express()

    this.config()
    this.defineDocs()
    this.api()
  }

  public static bootstrap (): Server {
    return new Server()
  }

  public defineDocs () {
    const swaggerUiHandler = swaggerUi.setup(swaggerSpec)
    this.app.use('/api/docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(swaggerSpec)
    })
    this.app.use('/api/docs/', swaggerUi.serve, swaggerUiHandler)
  }

  public api () {
    // ToDo: Auth check
    this.app.use('/api/v1', router)
    this.app.use(notFoundMiddleware)
    this.app.use(errorMiddleware)
  }

  public config () {
    Raven.config(
      config.sentry.enabled === true
        ? config.sentry.dsn || ''
        : false,
      {
        name: 'api',
        environment: 'dev',
        autoBreadcrumbs: true,
      }).install()

    this.app.use(Raven.requestHandler())
    this.app.use(corsMiddleware)
    this.app.use(express.json({ type: 'application/json', limit: '50mb' }))
  }
}
