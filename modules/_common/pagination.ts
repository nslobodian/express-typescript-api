export class Pagination {
  page: number
  perPage: number
  pages?: number
  totalCount?: number

  constructor (page: number = 0, perPage: number = 10) {
    this.page = page
    this.perPage = perPage
  }

  skip (): number {
    return this.perPage * this.page
  }

  take (): number {
    return this.perPage
  }
}
