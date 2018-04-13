import { getRepository } from 'typeorm'

import { FactoryService, ServiceFindOptions, ServiceListResult } from '../_common/serviceFactory'
import { User } from './user.entity'
import { NotFoundHttpError } from '../_common/errors/NotFoundHttpError'
import { CreateUserRequestDto } from './dto/create-user-request.dto'
import { UpdateUserRequestDto } from './dto/update-user-request.dto'

export class UserServiceBuilder extends FactoryService<User> {
  constructor () {
    const userRepo = getRepository<User>(User)
    super(userRepo, 'user')
  }

  find (options?: ServiceFindOptions): Promise<ServiceListResult<User>> {
    return this.getManyWithOptions(options)
  }

  async findOne (id: string, options: { relations?: string[] } = {}): Promise<User> {
    const user = await this.getNotDeletedOne(id, options)

    if (!user) {
      throw new NotFoundHttpError(`User #${id} not found.`)
    }

    return user
  }

  async create (dto: CreateUserRequestDto): Promise<User> {
    const user = this.repository.create(dto)
    return this.save(user) as Promise<User>
  }

  async update (id: string, dto: UpdateUserRequestDto): Promise<User> {
    const result = await this.repository.findOneById(id)
    if (!result) {
      throw new NotFoundHttpError(`User #${id} not found.`)
    }

    const user = Object.assign({}, result, dto)
    return this.repository.save(user)
  }

  async delete (id: string): Promise<User> {
    const user = Object.assign({}, await this.repository.findOneById(id), { isDeleted: true })
    return this.repository.save(user)
  }
}
