import { Controller, Get, Injectable, Module } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DatabaseModule } from '../database.module'
import { Person } from './person.schema'

export interface PersonDto {
  id: string
  name: string
  hue: number
}

@Injectable()
export class PeopleService {
  constructor(@InjectModel(Person.name) private readonly people: Model<Person>) {}

  async list(): Promise<PersonDto[]> {
    const rows = await this.people.find().sort({ name: 1 }).lean()
    return rows.map((p) => ({ id: p._id, name: p.name, hue: p.hue }))
  }

  async names(): Promise<Map<string, string>> {
    const rows = await this.people.find({}, { name: 1 }).lean()
    return new Map(rows.map((p) => [p._id, p.name]))
  }

  async find(id: string): Promise<PersonDto | null> {
    const p = await this.people.findById(id).lean()
    return p ? { id: p._id, name: p.name, hue: p.hue } : null
  }
}

@Controller('people')
export class PeopleController {
  constructor(private readonly people: PeopleService) {}

  @Get()
  list() {
    return this.people.list()
  }
}

@Module({
  imports: [DatabaseModule],
  providers: [PeopleService],
  controllers: [PeopleController],
  exports: [PeopleService],
})
export class PeopleModule {}
