# Express Typescript REST API Boilerplate
Boilerplate/Generator Project for building RESTful APIs using Typescript, Express and Typeorm

## Features
 - CORS enabled
 - Uses [yarn](https://yarnpkg.com)
 - Express + SQL ([Typeorm](http://typeorm.io/))
 - Consistent coding styles with [editorconfig](http://editorconfig.org)
 - Request validation with [joi](https://github.com/hapijs/joi)
 - Gzip compression with [compression](https://github.com/expressjs/compression)
 - Enviromet variables with [dotenv](https://github.com/bkeepers/dotenv)
 - Linting with [tslint](https://palantir.github.io/tslint/)
 - API documentation geratorion with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
 - API geratorion with [plop](https://github.com/amwmedia/plop/)

## Requirements

 - [Node v8.9.4+](https://nodejs.org/en/download/current/)
 - [Yarn](https://yarnpkg.com/en/docs/install)

## Installations

Copy `.env.example` to `.env`
Copy `modules/config/config.ts.template` to `modules/config/config.ts`

1. yarn install
2. yarn run start:watch

## Generate route
1. `yarn generate`
2. Follow the instructions
