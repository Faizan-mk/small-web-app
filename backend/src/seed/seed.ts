import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AppModule } from '../app.module'
import { addressWords } from '../common/address'
import { htmlToText } from '../common/text'
import { Person } from '../people/person.schema'
import { Site } from '../sites/site.schema'
import { Visit } from '../visits/visit.schema'
import { DAY, mulberry32, PREFIX, SEED_EPOCH, SEED_PEOPLE, TRAILS } from './data/history'
import { SEED_SITES } from './data/sites'

async function run() {
  const fresh = process.argv.includes('--fresh')
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] })
  const people = app.get<Model<Person>>(getModelToken(Person.name))
  const sites = app.get<Model<Site>>(getModelToken(Site.name))
  const visits = app.get<Model<Visit>>(getModelToken(Visit.name))
  const log = { log: (m: string) => console.log(`[seed] ${m}`) }

  if (fresh) {
    await Promise.all([people.deleteMany({}), sites.deleteMany({}), visits.deleteMany({})])
    log.log('Wiped people, sites and visits')
  }
  await Promise.all([people.syncIndexes(), sites.syncIndexes(), visits.syncIndexes()])

  await people.bulkWrite(
    SEED_PEOPLE.map((p) => ({
      replaceOne: { filter: { _id: p.id }, replacement: { _id: p.id, name: p.name, hue: p.hue, seeded: true }, upsert: true },
    })),
  )
  await people.deleteMany({ seeded: true, _id: { $nin: SEED_PEOPLE.map((p) => p.id) } })

  const siteDocs = SEED_SITES.map((s) => {
    const revisions = s.revisions.map((r) => ({ title: r.title, html: r.html, publishedAt: new Date(SEED_EPOCH - r.daysAgo * DAY) }))
    const current = revisions[revisions.length - 1]
    return {
      address: s.address,
      authorId: s.authorId,
      createdAt: revisions[0].publishedAt,
      revisions,
      title: current.title,
      text: htmlToText(current.html),
      addressWords: addressWords(s.address),
      updatedAt: current.publishedAt,
      seeded: true,
    }
  })
  await sites.bulkWrite(siteDocs.map((s) => ({ replaceOne: { filter: { address: s.address }, replacement: s, upsert: true } })))
  await sites.deleteMany({ seeded: true, address: { $nin: siteDocs.map((s) => s.address) } })

  const byAddress = new Map(siteDocs.map((s) => [s.address, s]))
  const rand = mulberry32(20261109)
  const visitDocs: Visit[] = []
  let n = 0
  for (const trail of TRAILS) {
    let at = SEED_EPOCH + trail.start * 60_000
    for (const step of trail.steps) {
      const how = PREFIX[step[0]]
      const address = how ? step.slice(1) : step
      const site = byAddress.get(address)
      visitDocs.push({
        seedKey: `seed-${++n}`,
        personId: trail.person,
        address,
        at: new Date(at),
        transition: how ?? 'link',
        found: Boolean(site),
        title: site?.title ?? null,
      })
      at += (20 + Math.floor(rand() * 90)) * 1000
    }
  }
  await visits.bulkWrite(visitDocs.map((v) => ({ replaceOne: { filter: { seedKey: v.seedKey }, replacement: v, upsert: true } })))
  await visits.deleteMany({ seedKey: { $exists: true, $nin: visitDocs.map((v) => v.seedKey) } })

  const [p, s, v] = await Promise.all([people.countDocuments(), sites.countDocuments(), visits.countDocuments()])
  log.log(`Seeded ${SEED_PEOPLE.length} people, ${siteDocs.length} sites, ${visitDocs.length} visits`)
  log.log(`Database now holds ${p} people, ${s} sites, ${v} visits`)
  await app.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
