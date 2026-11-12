import { Controller, Get, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { PeopleModule, PeopleService } from './people/people'
import { SearchModule } from './search/search.module'
import { SitesModule } from './sites/sites.module'
import { SitesService } from './sites/sites.service'
import { VisitsModule } from './visits/visits.module'
import { VisitsService } from './visits/visits.module'

@Controller('stats')
class StatsController {
  constructor(
    private readonly sites: SitesService,
    private readonly people: PeopleService,
    private readonly visits: VisitsService,
  ) {}

  @Get()
  async stats() {
    const [sites, people, visits] = await Promise.all([this.sites.count(), this.people.list(), this.visits.count()])
    return { sites, people: people.length, visits }
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI', 'mongodb://127.0.0.1:27017/smallweb_assessment'),
      }),
    }),
    PeopleModule,
    SitesModule,
    SearchModule,
    VisitsModule,
  ],
  controllers: [StatsController],
})
export class AppModule {}
