import * as express from 'express'

import { ProductServiceBuilder } from './product.service'
import { Pagination } from '../_common/pagination'
import { validationMiddleware } from '../_common/middlewares/validation.middleware'
import { CreateProductRequestDto } from './dto/create-product-request.dto'
import { UpdateProductRequestDto } from './dto/update-product-request.dto'

const productRouter = express.Router()

/**
 * @swagger
 * definitions:
 *   Product:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       createdAt:
 *         type: string
 *       updatedAt:
 *         type: string
 *       isDeleted:
 *         type: boolean
 *     example:
 *      "id": "bead1356-f05f-4bd9-9c85-7d0b19c6aed0"
 *      "createdAt": "2018-02-22T13:27:25.042Z"
 *      "updatedAt": "2018-02-22T13:27:25.042Z"
 *      "isDeleted": false
 *      "name": "Test"
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Returns list of products
 *     tags:
 *      - Products
 *     parameters:
 *       - $ref: '#/parameters/perPage'
 *       - $ref: '#/parameters/page'
 *       - $ref: '#/parameters/with'
 *       - $ref: '#/parameters/sorts'
 *       - $ref: '#/parameters/filters'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           properties:
 *             pagination:
 *               type: object
 *               $ref: '#/definitions/Pagination'
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Product'
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add new product
 *     tags:
 *       - Products
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         description: product name
 *         schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              example: Support of Spider-man
 *     responses:
 *       201:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/Product'
 */

productRouter.route('/')
  .get(async function (req: express.Request, res, next) {
    try {
      const productService = new ProductServiceBuilder()
      const query = req.query

      res.status(200).json(await productService.find({
        pagination: new Pagination(query.page, query.perPage),
        relations: query.with ? query.with.split(',') : null,
        sorts: query.sorts ? query.sorts.split(',') : null,
        filters: query.filters ? query.filters.split(',') : null,
      }))
    } catch (err) {
      next(err)
    }
  })
  .post(
    validationMiddleware(CreateProductRequestDto),
    async function (req: express.Request, res, next) {
      try {
        const productService = new ProductServiceBuilder()

        const product = await productService.create(req.body)
        res.status(201).json(product)
      } catch (err) {
        next(err)
      }
    })

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product with specific id
 *     tags:
 *      - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *     responses:
 *       200:
 *         $ref: '#/definitions/Product'
 *       404:
 *         description: get non-existing product
 *         schema:
 *           $ref: '#/definitions/Error'
 *
 *   put:
 *     summary: Update product
 *     tags:
 *      - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *       - in: body
 *         name: body
 *         required: true
 *         description: product name
 *         schema:
 *          $ref: '#/definitions/Product'
 *     responses:
 *       200:
 *         $ref: '#/definitions/Product'
 *       404:
 *         description: update non-existing product
 *         schema:
 *           $ref: '#/definitions/Error'
 *
 *   delete:
 *     summary: Delete specific product
 *     tags:
 *      - Products
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *     responses:
 *       200:
 *         description: delete at first time
 *         $ref: '#/definitions/Product'
 *       404:
 *         description: delete non-existing product
 *         schema:
 *           $ref: '#/definitions/Error'
 */

productRouter.route('/:id')
  .get(
    async function (req: express.Request, res, next) {
      try {
        const productService = new ProductServiceBuilder()
        const productId = req.params.id

        const product = await productService.findOne(productId)
        res.status(200).json(product)
      } catch (err) {
        next(err)
      }
    })
  .delete(
    async function (req: express.Request, res, next) {
      try {
        const productService = new ProductServiceBuilder()
        const productId = req.params.id

        const product = await productService.delete(productId)
        res.status(200).json(product)
      } catch (err) {
        next(err)
      }
    })
  .put(
    validationMiddleware(UpdateProductRequestDto),
    async function (req: express.Request, res, next) {
      try {
        const productService = new ProductServiceBuilder()
        const productId = req.params.id

        const product = await productService.update(productId, req.body)
        res.status(200).json(product)
      } catch (err) {
        next(err)
      }
    })

export { productRouter }
