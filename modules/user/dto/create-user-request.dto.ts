import { IsString } from 'class-validator'

type CreateUserRequestDtoType = {
  name: string
}

export class CreateUserRequestDto {
  @IsString()
  name: string

  constructor (data: CreateUserRequestDtoType) {
    this.name = data.name
  }
}
