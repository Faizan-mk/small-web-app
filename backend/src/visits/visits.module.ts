import { BadRequestException, Body, Controller, Get, Injectable, Module, Param, Post, Query } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { Model } from 'mongoose'
import { normalizeAddress } from '../common/address'
import { DatabaseModule } from '../database.module'
import { PeopleModule, PeopleService } from '../people/people'
import { Site } from '../sites/site.schema'
import { TRANSITIONS, Visit, type Transition } from './visit.schema'

export class RecordVisitDto {
  @IsString()
  @IsNotEmpty()
  personId: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  address: string

  @IsIn(TRANSITIONS)
  transition: Transition
}

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private readonly visits: Model<Visit>,
    @InjectModel(Site.name) private readonly sites: Model<Site>,
    private readonly people: PeopleService,
  ) {}

  async record(dto: RecordVisitDto) {
    if (!(await this.people.find(dto.personId))) throw new BadRequestException('Unknown person.')
    const address = normalizeAddress(dto.address)
    const site = await this.sites.findOne({ address }, { title: 1 }).lean()
    const v = await this.visits.create({
      personId: dto.personId,
      address,
      at: new Date(),
      transition: dto.transition,
      found: Boolean(site),
      title: site?.title ?? null,
    })
    return this.toDto(v.toObject())
  }

  async history(personId: string, limit = 500) {
    const rows = await this.visits.find({ personId }).sort({ at: -1, _id: -1 }).limit(limit).lean()
    return rows.map((v) => this.toDto(v))
  }

  async count() {
    return this.visits.estimatedDocumentCount()
  }

  private toDto(v: Visit & { _id: unknown }) {
    return {
      id: String(v._id),
      personId: v.personId,
      address: v.address,
      at: v.at.getTime(),
      transition: v.transition,
      found: v.found,
      title: v.title,
    }
  }
}

@Controller()
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  @Post('visits')
  record(@Body() dto: RecordVisitDto) {
    return this.visits.record(dto)
  }

  @Get('people/:id/visits')
  history(@Param('id') id: string, @Query('limit') limit?: string) {
    const n = Math.min(Math.max(Number(limit) || 500, 1), 2000)
    return this.visits.history(id, n)
  }
}

@Module({
  imports: [DatabaseModule, PeopleModule],
  providers: [VisitsService],
  controllers: [VisitsController],
  exports: [VisitsService],
})
export class VisitsModule {}
