import { Repository, SelectQueryBuilder } from 'typeorm'

import { Pagination } from './pagination'
import { DeepPartial } from 'typeorm/browser/common/DeepPartial'
import { BadRequestHttpError } from './errors/BadRequestHttpError'

enum OrderType { ASC = 'ASC', DESC = 'DESC' }

export type ServiceListResult<T> = { pagination: Pagination | {}, data: T[] }
export type AccessTokenResponse = { accessToken: string, expiresIn: number }
export type ResetTokenCheckResponse = { isValid: boolean }
export type FilterOptions = { name: string, value: string, operator: string }
export type ServiceFindOptions = {
  pagination?: Pagination,
  ids?: string[],
  relations?: string[],
  sorts?: string[],
  filters?: string[],
}
type SortOption = {
  order: OrderType.ASC | OrderType.DESC,
  name: string,
}

function formatSortsOptions (sorts: string[]): SortOption[] {
  return sorts.map(sort => {
    const firstChar = sort[0]
    if (firstChar === '-') {
      return {
        order:  OrderType.DESC,
        name: sort.substring(1)
      }
    }

    if (firstChar === '+') {
      return {
        order: OrderType.ASC,
        name: sort.substring(1)
      }
    }

    return {
      order: OrderType.ASC,
      name: sort,
    }
  })
}

function getOperator (filter: string, indexOfEndOfName: number): string | null {
  const firstCharOperator = filter[indexOfEndOfName + 1]
  const secondCharOperator = filter[indexOfEndOfName + 2]

  if (!/^[\w]+$/.test(secondCharOperator)) {
    return firstCharOperator + secondCharOperator
  }

  if (!/^[\w]+$/.test(firstCharOperator)) {
    return firstCharOperator
  }

  return null
}

/**
 * This function takes: 'name:value' or 'name:>value'. First works as range and second as regex.
 */
function formatFilterOptions (filters: string[]): FilterOptions[] {
  return filters.map(filter => {
    const indexOfEndOfName = filter.indexOf(':')
    const name = filter.slice(0, indexOfEndOfName) || ''

    const operator = getOperator(filter, indexOfEndOfName)
    if (operator) {
      return {
        name,
        operator,
        value: filter.slice(indexOfEndOfName + operator.length + 1),
      }
    }

    return {
      name,
      operator: '~*',
      value: filter.slice(indexOfEndOfName + 1),
    }
  })
}

export class FactoryServiceQuery<T> {
  query: SelectQueryBuilder<T>
  pagination: Pagination | {}
  alias: string

  constructor (query: SelectQueryBuilder<T>, alias: string) {
    this.pagination = new Pagination()
    this.query = query
    this.alias = alias
  }

  public async paginate (pagination: Pagination): Promise<FactoryServiceQuery<T>> {
    this.query
      .skip(pagination.skip())
      .take(pagination.take())

    pagination.totalCount = await this.query.getCount()
    pagination.pages = Math.ceil(pagination.totalCount / pagination.perPage)
    this.pagination = pagination

    return this
  }

  public relate (relations: string[] | undefined): FactoryServiceQuery<T> {
    if (relations && relations.length > 0) {
      relations.forEach(relation => {
        try {
          this.query.leftJoinAndSelect(`${this.alias}.${relation}`, relation)
        } catch (err) {
          throw new BadRequestHttpError(`${relation} relation does not exist.`)
        }
      })
    }

    return this
  }

  public byIds (ids: string[] | undefined): FactoryServiceQuery<T> {
    if (ids && ids.length > 0) {
      this.query.andWhere(`${this.alias}."id" in (:ids)`, { ids })
    }

    return this
  }

  public sort (sorts: string[] | undefined): FactoryServiceQuery<T> {
    if (sorts && sorts.length > 0) {
      formatSortsOptions(sorts).forEach(sort => this.query.orderBy(`${this.alias}.${sort.name}`, sort.order))
    }

    return this
  }

  public applyFilters (filters: string[] | undefined): FactoryServiceQuery<T> {
    if (filters && filters.length > 0) {
      formatFilterOptions(filters)
        .forEach((filter, index) => this.query.andWhere(
          `"${this.alias}"."${filter.name}" ${filter.operator} :${filter.name}_${index}`,
          { [`${filter.name}_${index}`]: filter.value })
        )
    }

    return this
  }

  public async formatWithOptions (options: ServiceFindOptions = {}): Promise<FactoryServiceQuery<T>> {
    if (options.relations) {
      this.relate(options.relations)
    }

    if (options.ids) {
      this.byIds(options.ids)
    }

    if (options.sorts) {
      this.sort(options.sorts)
    }

    if (options.filters) {
      this.applyFilters(options.filters)
    }

    if (options.pagination) {
      await this.paginate(options.pagination)
    }

    return this
  }

  public notDeleted (): FactoryServiceQuery<T> {
    this.query.andWhere(`"${this.alias}"."isDeleted" != :isDeleted`, { isDeleted: true })
    return this
  }

  public getFormattedQuery (): SelectQueryBuilder<T> {
    return this.query
  }

  public setSelect (selection: string, selectionAliasName?: string): FactoryServiceQuery<T> {
    this.query.select(selection, selectionAliasName)
    return this
  }
}

export class FactoryService<T> {
  repository: Repository<T>
  alias: string

  constructor (repository: Repository<T>, alias: string) {
    this.repository = repository
    this.alias = alias
  }

  public getQueryBuilder (): FactoryServiceQuery<T> {
    return new FactoryServiceQuery<T>(this.repository.createQueryBuilder(this.alias), this.alias)
  }

  public getNotDeletedOne (id: string, options: { relations?: string[] } = {}): Promise<T | undefined> {
    return this
      .getQueryBuilder()
      .notDeleted()
      .relate(options.relations)
      .getFormattedQuery()
      .andWhere(`"${this.alias}"."id" = :id`, { id })
      .getOne()
  }

  public getOne (id: string, options: { relations?: string[] } = {}): Promise<T | undefined> {
    return this
      .getQueryBuilder()
      .relate(options.relations)
      .getFormattedQuery()
      .andWhere(`"${this.alias}"."id" = :id`, { id })
      .getOne()
  }

  public async getManyWithOptions (options: ServiceFindOptions = {}): Promise<any> {
    const query = await this
      .getQueryBuilder()
      .formatWithOptions(options)

    if (!options.filters || !options.filters.includes('isDeleted:=true')) {
      query.notDeleted()
    }

    return {
      pagination: query.pagination,
      data: await query.getFormattedQuery().getMany(),
    }
  }

  public getQuery (): SelectQueryBuilder<T> {
    return this
      .getQueryBuilder()
      .getFormattedQuery()
  }

  public async save (data: DeepPartial<T>): Promise<DeepPartial<T>> {
    if (!data) {
      throw new BadRequestHttpError('No data')
    }

    return this.repository.save(data)
  }
}
