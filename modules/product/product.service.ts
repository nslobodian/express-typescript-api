import { getRepository } from 'typeorm'

import { FactoryService, ServiceFindOptions, ServiceListResult } from '../_common/serviceFactory'
import { Product } from './product.entity'
import { NotFoundHttpError } from '../_common/errors/NotFoundHttpError'
import { CreateProductRequestDto } from './dto/create-product-request.dto'
import { UpdateProductRequestDto } from './dto/update-product-request.dto'

export class ProductServiceBuilder extends FactoryService<Product> {
  constructor () {
    const productRepo = getRepository<Product>(Product)
    super(productRepo, 'product')
  }

  find (options?: ServiceFindOptions): Promise<ServiceListResult<Product>> {
    return this.getManyWithOptions(options)
  }

  async findOne (id: string, options: { relations?: string[] } = {}): Promise<Product> {
    const product = await this.getNotDeletedOne(id, options)

    if (!product) {
      throw new NotFoundHttpError(`Product #${id} not found.`)
    }

    return product
  }

  async create (dto: CreateProductRequestDto): Promise<Product> {
    const product = this.repository.create(dto)
    return this.save(product) as Promise<Product>
  }

  async update (id: string, dto: UpdateProductRequestDto): Promise<Product> {
    const result = await this.repository.findOneById(id)
    if (!result) {
      throw new NotFoundHttpError(`Product #${id} not found.`)
    }

    const product = Object.assign({}, result, dto)
    return this.repository.save(product)
  }

  async delete (id: string): Promise<Product> {
    const product = Object.assign({}, await this.repository.findOneById(id), { isDeleted: true })
    return this.repository.save(product)
  }
}
