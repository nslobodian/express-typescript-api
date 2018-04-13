import { IsString } from 'class-validator'

type CreateProductRequestDtoType = {
  name: string
}

export class CreateProductRequestDto {
  @IsString()
  name: string

  constructor (data: CreateProductRequestDtoType) {
    this.name = data.name
  }
}
