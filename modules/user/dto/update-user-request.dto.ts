import { IsString, IsOptional } from 'class-validator'

type UpdateUserRequestDtoType = {
  name?: string
}

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  name?: string

  constructor (data: UpdateUserRequestDtoType) {
    this.name = data.name
  }
}
