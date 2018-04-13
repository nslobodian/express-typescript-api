import { Entity, Column, OneToMany } from 'typeorm'
import { CommonEntity } from '../_common/entity'

@Entity()
export class Product extends CommonEntity {
  @Column({ unique: true, length: '128' })
  name: string
}
