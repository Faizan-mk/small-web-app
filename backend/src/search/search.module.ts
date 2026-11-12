import { Controller, Get, Injectable, Module, Query } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { queryTerms, snippet, type SnippetPart } from '../common/text'
import { DatabaseModule } from '../database.module'
import { PeopleModule, PeopleService } from '../people/people'
import { Site } from '../sites/site.schema'

export interface SearchResult {
  address: string
  title: string
  authorName: string
  snippet: SnippetPart[]
  score: number
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Site.name) private readonly sites: Model<Site>,
    private readonly people: PeopleService,
  ) {}

  async search(raw: string): Promise<SearchResult[]> {
    const q = raw.trim().slice(0, 200)
    const terms = queryTerms(q)
    if (!terms.length) return []
    const names = await this.people.names()
    const fields = { address: 1, title: 1, text: 1, authorId: 1 }

    let rows: (Pick<Site, 'address' | 'title' | 'text' | 'authorId'> & { score?: number })[] = await this.sites
      .find({ $text: { $search: q } }, { ...fields, score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(50)
      .lean()

    if (rows.length === 0) {
      const all = terms.map((t) => {
        const re = new RegExp(`\\b${escape(t)}`, 'i')
        return { $or: [{ title: re }, { addressWords: re }, { text: re }] }
      })
      rows = (await this.sites.find({ $and: all }, fields).limit(50).lean()).map((r) => ({ ...r, score: 0.5 }))
    }

    return rows.map((r) => ({
      address: r.address,
      title: r.title,
      authorName: names.get(r.authorId) ?? 'Unknown author',
      snippet: snippet(r.text, terms),
      score: Math.round((r.score ?? 0) * 100) / 100,
    }))
  }
}

@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get()
  find(@Query('q') q = '') {
    return this.search.search(String(q))
  }
}

@Module({
  imports: [DatabaseModule, PeopleModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
