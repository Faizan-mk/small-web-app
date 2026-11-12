import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ADDRESS_RE, addressWords, normalizeAddress } from '../common/address'
import { editDistance, excerpt, htmlToText } from '../common/text'
import { PeopleService } from '../people/people'
import { Visit } from '../visits/visit.schema'
import { PublishSiteDto } from './dto'
import { Site } from './site.schema'

export interface SiteSummary {
  address: string
  title: string
  authorId: string
  authorName: string
  updatedAt: number
  revision: number
}

type SiteRow = Pick<Site, 'address' | 'title' | 'authorId' | 'updatedAt' | 'revisions'>

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name) private readonly sites: Model<Site>,
    @InjectModel(Visit.name) private readonly visits: Model<Visit>,
    private readonly people: PeopleService,
  ) {}

  private summary(s: SiteRow, names: Map<string, string>): SiteSummary {
    return {
      address: s.address,
      title: s.title,
      authorId: s.authorId,
      authorName: names.get(s.authorId) ?? 'Unknown author',
      updatedAt: s.updatedAt.getTime(),
      revision: s.revisions.length,
    }
  }

  async list() {
    const [rows, names] = await Promise.all([this.sites.find().sort({ title: 1 }).lean(), this.people.names()])
    return rows.map((s) => ({ ...this.summary(s, names), excerpt: excerpt(s.revisions[s.revisions.length - 1].html) }))
  }

  async get(rawAddress: string, personId?: string) {
    const address = normalizeAddress(rawAddress)
    const [site, names] = await Promise.all([this.sites.findOne({ address }).lean(), this.people.names()])
    if (!site) {
      throw new NotFoundException({ site: null, suggestions: await this.suggestions(address, names) })
    }
    const current = site.revisions[site.revisions.length - 1]
    const page = { ...this.summary(site, names), html: current.html }
    if (!personId) return { site: page, prior: null, visited: [] }

    const mine = { personId, found: true }
    const [count, last, visited] = await Promise.all([
      this.visits.countDocuments({ ...mine, address }),
      this.visits.findOne({ ...mine, address }).sort({ at: -1 }).lean(),
      this.visits.distinct('address', mine),
    ])
    return {
      site: page,
      prior: count ? { count, last: last!.at.getTime() } : null,
      visited,
    }
  }

  private async suggestions(address: string, names: Map<string, string>): Promise<SiteSummary[]> {
    const name = address.split('.')[0]
    const rows = await this.sites.find({}, { address: 1, title: 1, authorId: 1, updatedAt: 1, revisions: { $slice: -1 } }).lean()
    return rows
      .map((s) => ({ s, other: s.address.split('.')[0] }))
      .map(({ s, other }) => ({ s, other, dist: editDistance(name, other) }))
      .filter(({ other, dist }) => dist <= 3 || other.includes(name) || name.includes(other))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 4)
      .map(({ s }) => this.summary(s, names))
  }

  async publish(dto: PublishSiteDto) {
    const address = normalizeAddress(dto.address)
    if (!ADDRESS_RE.test(address)) {
      throw new BadRequestException(
        'An address looks like name.zz: lowercase letters, digits and hyphens, then a dot and a suffix.',
      )
    }
    const author = await this.people.find(dto.authorId)
    if (!author) throw new BadRequestException('Pick who is publishing.')

    const now = new Date()
    const revision = { title: dto.title.trim(), html: dto.html, publishedAt: now }
    const current = { title: revision.title, text: htmlToText(dto.html), addressWords: addressWords(address), updatedAt: now }

    const existing = await this.sites.findOne({ address }, { authorId: 1 }).lean()
    if (existing) {
      if (existing.authorId !== author.id) {
        const owner = (await this.people.find(existing.authorId))?.name ?? 'someone else'
        throw new ConflictException(`${address} already belongs to ${owner}. Only its author can publish there.`)
      }
      await this.sites.updateOne({ address, authorId: author.id }, { $push: { revisions: revision }, $set: current })
    } else {
      try {
        await this.sites.create({ address, authorId: author.id, createdAt: now, revisions: [revision], ...current })
      } catch (err) {
        if ((err as { code?: number }).code === 11000) throw new ConflictException(`${address} was just taken.`)
        throw err
      }
    }
    const saved = (await this.sites.findOne({ address }).lean())!
    return { site: this.summary(saved, await this.people.names()), created: !existing }
  }

  async count(): Promise<number> {
    return this.sites.countDocuments()
  }
}
