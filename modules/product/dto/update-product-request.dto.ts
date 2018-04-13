import { IsString, IsOptional } from 'class-validator'

type UpdateProductRequestDtoType = {
  name?: string
}

export class UpdateProductRequestDto {
  @IsString()
  @IsOptional()
  name?: string

  constructor (data: UpdateProductRequestDtoType) {
    this.name = data.name
  }
}
