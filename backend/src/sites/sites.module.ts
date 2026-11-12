import { Body, Controller, Get, Module, Param, Post, Query } from '@nestjs/common'
import { DatabaseModule } from '../database.module'
import { PeopleModule } from '../people/people'
import { PublishSiteDto } from './dto'
import { SitesService } from './sites.service'

@Controller('sites')
export class SitesController {
  constructor(private readonly sites: SitesService) {}

  @Get()
  list() {
    return this.sites.list()
  }

  @Get(':address')
  get(@Param('address') address: string, @Query('person') person?: string) {
    return this.sites.get(address, person)
  }

  @Post()
  publish(@Body() dto: PublishSiteDto) {
    return this.sites.publish(dto)
  }
}

@Module({
  imports: [DatabaseModule, PeopleModule],
  providers: [SitesService],
  controllers: [SitesController],
  exports: [SitesService],
})
export class SitesModule {}
